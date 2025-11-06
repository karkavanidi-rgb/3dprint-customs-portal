import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление портфолио (получение, добавление, редактирование, удаление)
    Args: event - dict с httpMethod, body, headers
          context - объект с request_id
    Returns: JSON результат операции
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
    
    headers = event.get('headers', {})
    admin_token = headers.get('x-admin-token') or headers.get('X-Admin-Token')
    is_admin = admin_token == 'a8f3K9mP2xR7qL5nB4vC6wE1sH0jT3yU8zG2d'
    
    # Для всех методов кроме GET требуется админ токен
    if method != 'GET' and not is_admin:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    if method == 'GET':
        # Если админ - показываем все, иначе только видимые
        if is_admin:
            cursor.execute('''
                SELECT id, title, description, image_url, display_order, is_visible, created_at, updated_at
                FROM portfolio
                ORDER BY display_order ASC, created_at DESC
            ''')
        else:
            cursor.execute('''
                SELECT id, title, description, image_url, display_order, is_visible
                FROM portfolio
                WHERE is_visible = true
                ORDER BY display_order ASC
            ''')
        
        columns = [desc[0] for desc in cursor.description]
        portfolio = []
        
        for row in cursor.fetchall():
            item_dict = dict(zip(columns, row))
            # Форматируем даты только для админа (у публичного запроса их нет)
            if is_admin:
                if item_dict.get('created_at'):
                    item_dict['created_at'] = item_dict['created_at'].isoformat()
                if item_dict.get('updated_at'):
                    item_dict['updated_at'] = item_dict['updated_at'].isoformat()
            portfolio.append(item_dict)
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'isBase64Encoded': False,
            'body': json.dumps({'portfolio': portfolio})
        }
    
    elif method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        title = body_data.get('title')
        description = body_data.get('description', '')
        image_url = body_data.get('image_url')
        display_order = body_data.get('display_order', 0)
        is_visible = body_data.get('is_visible', True)
        
        if not title or not image_url:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Title and image_url are required'})
            }
        
        cursor.execute('''
            INSERT INTO portfolio (title, description, image_url, display_order, is_visible)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        ''', (title, description, image_url, display_order, is_visible))
        
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
        title = body_data.get('title')
        description = body_data.get('description')
        image_url = body_data.get('image_url')
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
            UPDATE portfolio 
            SET title = COALESCE(%s, title),
                description = COALESCE(%s, description),
                image_url = COALESCE(%s, image_url),
                display_order = COALESCE(%s, display_order),
                is_visible = COALESCE(%s, is_visible),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = %s
            RETURNING id
        ''', (title, description, image_url, display_order, is_visible, item_id))
        
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
        
        cursor.execute('DELETE FROM portfolio WHERE id = %s RETURNING id', (item_id,))
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