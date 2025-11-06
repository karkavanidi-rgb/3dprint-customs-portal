import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение списка клиентов для отображения на сайте и управление ими в админке
    Args: event - dict с httpMethod, body, headers
          context - объект с request_id
    Returns: JSON список клиентов или результат операции
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    headers = event.get('headers', {})
    admin_token = headers.get('x-admin-token') or headers.get('X-Admin-Token')
    is_admin = admin_token == 'a8f3K9mP2xR7qL5nB4vC6wE1sH0jT3yU8zG2d'
    
    if method == 'GET':
        if is_admin:
            cursor.execute('''
                SELECT id, name, logo_url, display_order, is_visible, created_at, updated_at
                FROM t_p54189513_3dprint_customs_port.clients
                ORDER BY display_order ASC, created_at DESC
            ''')
        else:
            cursor.execute('''
                SELECT id, name, logo_url, display_order
                FROM t_p54189513_3dprint_customs_port.clients
                WHERE is_visible = true
                ORDER BY display_order ASC
            ''')
        
        columns = [desc[0] for desc in cursor.description]
        clients = []
        
        for row in cursor.fetchall():
            item_dict = dict(zip(columns, row))
            if item_dict.get('created_at'):
                item_dict['created_at'] = item_dict['created_at'].isoformat()
            if item_dict.get('updated_at'):
                item_dict['updated_at'] = item_dict['updated_at'].isoformat()
            clients.append(item_dict)
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'clients': clients})
        }
    
    if not is_admin:
        cursor.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        name = body_data.get('name')
        logo_url = body_data.get('logo_url')
        display_order = body_data.get('display_order', 0)
        is_visible = body_data.get('is_visible', True)
        
        if not name or not logo_url:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Name and logo_url are required'})
            }
        
        cursor.execute('''
            INSERT INTO t_p54189513_3dprint_customs_port.clients (name, logo_url, display_order, is_visible)
            VALUES (%s, %s, %s, %s)
            RETURNING id
        ''', (name, logo_url, display_order, is_visible))
        
        new_id = cursor.fetchone()[0]
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'success': True, 'id': new_id})
        }
    
    elif method == 'PUT':
        body_data = json.loads(event.get('body', '{}'))
        
        item_id = body_data.get('id')
        name = body_data.get('name')
        logo_url = body_data.get('logo_url')
        display_order = body_data.get('display_order')
        is_visible = body_data.get('is_visible')
        
        if not item_id:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'ID is required'})
            }
        
        cursor.execute('''
            UPDATE t_p54189513_3dprint_customs_port.clients 
            SET name = COALESCE(%s, name),
                logo_url = COALESCE(%s, logo_url),
                display_order = COALESCE(%s, display_order),
                is_visible = COALESCE(%s, is_visible),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id
        ''', (name, logo_url, display_order, is_visible, item_id))
        
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        if result:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True, 'id': item_id})
            }
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Item not found'})
            }
    
    elif method == 'DELETE':
        body_data = json.loads(event.get('body', '{}'))
        item_id = body_data.get('id')
        
        if not item_id:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'ID is required'})
            }
        
        cursor.execute('DELETE FROM t_p54189513_3dprint_customs_port.clients WHERE id = %s RETURNING id', (item_id,))
        result = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        if result:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Item not found'})
            }
    
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'})
    }
