import json
import os
import base64
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Управление портфолио (получение, добавление, редактирование, удаление) и загрузка изображений
    Args: event - dict с httpMethod, body, headers, queryStringParameters
          context - объект с request_id
    Returns: JSON результат операции или URL загруженного изображения
    '''
    method: str = event.get('httpMethod', 'GET')
    query_params = event.get('queryStringParameters', {}) or {}
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # Обработка загрузки изображений
    if method == 'POST' and query_params.get('upload') == 'true':
        try:
            body = event.get('body', '')
            is_base64 = event.get('isBase64Encoded', False)
            
            if not body:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'No file provided'}),
                    'isBase64Encoded': False
                }
            
            content_type = event.get('headers', {}).get('content-type', '')
            if 'multipart/form-data' not in content_type.lower():
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Content-Type must be multipart/form-data'}),
                    'isBase64Encoded': False
                }
            
            # Decode if base64
            if is_base64:
                body_bytes = base64.b64decode(body)
            else:
                body_bytes = body.encode('latin-1')
            
            # Extract boundary
            boundary = None
            for part in content_type.split(';'):
                if 'boundary=' in part:
                    boundary = part.split('boundary=')[1].strip()
                    break
            
            if not boundary:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'No boundary found'}),
                    'isBase64Encoded': False
                }
            
            # Split by boundary
            parts = body_bytes.split(f'--{boundary}'.encode())
            
            image_data = None
            mime_type = 'image/jpeg'
            
            for part in parts:
                if b'Content-Disposition' in part and b'filename=' in part:
                    header_end = part.find(b'\r\n\r\n')
                    if header_end == -1:
                        header_end = part.find(b'\n\n')
                    
                    if header_end != -1:
                        headers_part = part[:header_end]
                        content_part = part[header_end + 4:]
                        content_part = content_part.rstrip(b'\r\n-')
                        
                        if b'Content-Type:' in headers_part:
                            for line in headers_part.split(b'\n'):
                                if b'Content-Type:' in line:
                                    mime_type = line.split(b':')[1].strip().decode('utf-8')
                        
                        image_data = content_part
                        break
            
            if not image_data:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'No image data found'}),
                    'isBase64Encoded': False
                }
            
            # Convert to base64 data URL
            image_base64 = base64.b64encode(image_data).decode('utf-8')
            data_url = f'data:{mime_type};base64,{image_base64}'
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'url': data_url}),
                'isBase64Encoded': False
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'Upload failed: {str(e)}'}),
                'isBase64Encoded': False
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