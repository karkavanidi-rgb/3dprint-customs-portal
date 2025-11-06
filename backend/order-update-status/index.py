import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Обновление статуса заявки
    Args: event - dict с httpMethod, body (order_id, status)
          context - объект с request_id
    Returns: JSON результат операции
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    headers = event.get('headers', {})
    admin_token = headers.get('x-admin-token') or headers.get('X-Admin-Token')
    
    if not admin_token or admin_token != os.environ.get('ADMIN_TOKEN', 'default-secret-token'):
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Unauthorized'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    order_id = body_data.get('order_id')
    new_status = body_data.get('status')
    
    if not order_id or not new_status:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing order_id or status'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE orders 
        SET status = %s, updated_at = CURRENT_TIMESTAMP
        WHERE id = %s
        RETURNING id
    ''', (new_status, order_id))
    
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
            'body': json.dumps({'success': True, 'order_id': order_id, 'status': new_status})
        }
    else:
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Order not found'})
        }
