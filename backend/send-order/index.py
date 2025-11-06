'''
Business: Отправка заказа на 3D печать на email с генерацией номера заказа
Args: event - dict with httpMethod, body (JSON с данными формы)
      context - object with attributes: request_id, function_name
Returns: HTTP response с номером заказа
'''

import json
import smtplib
import os
import base64
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
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
    
    body_data = json.loads(event.get('body', '{}'))
    
    order_number = f"3DP-{datetime.now().strftime('%Y%m%d')}-{context.request_id[:8].upper()}"
    
    dsn = os.environ.get('DATABASE_URL')
    if dsn:
        try:
            conn = psycopg2.connect(dsn)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO orders 
                (customer_type, company_name, inn, email, phone, length, width, height, 
                 plastic_type, color, infill, quantity, description, file_name, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            ''', (
                body_data.get('customerType'),
                body_data.get('companyName'),
                body_data.get('inn'),
                body_data.get('email'),
                body_data.get('phone'),
                body_data.get('length'),
                body_data.get('width'),
                body_data.get('height'),
                body_data.get('plastic'),
                body_data.get('color'),
                body_data.get('infill'),
                body_data.get('quantity'),
                body_data.get('description'),
                body_data.get('fileName'),
                'new'
            ))
            
            order_id = cursor.fetchone()[0]
            conn.commit()
            cursor.close()
            conn.close()
            print(f"✅ Order #{order_id} saved to database")
        except Exception as e:
            print(f"⚠️ Failed to save to database: {e}")
    
    email_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb;">Новый заказ №{order_number}</h2>
        
        <h3>Параметры печати:</h3>
        <ul>
            <li><strong>Размеры:</strong> {body_data.get('length')} x {body_data.get('width')} x {body_data.get('height')} мм</li>
            <li><strong>Материал:</strong> {body_data.get('plastic')}</li>
            <li><strong>Цвет:</strong> {body_data.get('color')}</li>
            <li><strong>Заполнение:</strong> {body_data.get('infill')}%</li>
            <li><strong>Количество:</strong> {body_data.get('quantity')} шт</li>
        </ul>
        
        <h3>Тип заказчика:</h3>
        <p><strong>{body_data.get('customerType')}</strong></p>
        {'<p><strong>Компания:</strong> ' + body_data.get('companyName', '') + '</p>' if body_data.get('customerType') == 'legal' else ''}
        {'<p><strong>ИНН:</strong> ' + body_data.get('inn', '') + '</p>' if body_data.get('customerType') == 'legal' else ''}
        
        <h3>Контакты:</h3>
        <ul>
            <li><strong>Email:</strong> {body_data.get('email')}</li>
            <li><strong>Телефон:</strong> {body_data.get('phone', 'Не указан')}</li>
        </ul>
        
        {'<h3>Файл модели:</h3><p>✅ Файл прикреплен: <strong>' + body_data.get('fileName', '') + '</strong></p>' if body_data.get('fileName') else '<p>❌ Файл не прикреплен</p>'}
        
        <h3>Описание:</h3>
        <p>{body_data.get('description', 'Не указано')}</p>
        
        <hr style="margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">Дата заказа: {datetime.now().strftime('%d.%m.%Y %H:%M')}</p>
    </body>
    </html>
    """
    
    smtp_server = os.environ.get('SMTP_SERVER', 'mail.3dprintcustom.ru')
    smtp_port = 587
    smtp_user_short = os.environ.get('SMTP_USER_SHORT', 'zakaz')
    smtp_user = smtp_user_short if '@' in smtp_user_short else f'{smtp_user_short}@3dprintcustom.ru'
    smtp_password = 'rS9aF7pO6shV3lQ0'
    

    
    if not smtp_user or not smtp_password:
        print("⚠️ SMTP not configured - saving order data only")
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'orderNumber': order_number,
                'message': 'Order saved. Email configuration required.',
                'orderData': {
                    'dimensions': f"{body_data.get('length')}x{body_data.get('width')}x{body_data.get('height')}",
                    'plastic': body_data.get('plastic'),
                    'color': body_data.get('color'),
                    'email': body_data.get('email'),
                    'phone': body_data.get('phone')
                }
            })
        }
    
    msg_company = MIMEMultipart()
    msg_company['Subject'] = f'Новый заказ на 3D печать №{order_number}'
    msg_company['From'] = smtp_user
    msg_company['To'] = 'zakaz@3dprintcustom.ru'
    msg_company.attach(MIMEText(email_body, 'html', 'utf-8'))
    
    file_base64 = body_data.get('fileBase64', '')
    file_name = body_data.get('fileName', '')
    
    print(f"📎 File check: fileName='{file_name}', base64_length={len(file_base64) if file_base64 else 0}")
    
    if file_base64 and file_name:
        print(f"✅ Attaching file: {file_name}")
        file_data = base64.b64decode(file_base64)
        print(f"📦 Decoded file size: {len(file_data)} bytes")
        
        part = MIMEBase('application', 'octet-stream')
        part.set_payload(file_data)
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', f'attachment; filename={file_name}')
        msg_company.attach(part)
    else:
        print("⚠️ No file attached to this order")
    
    client_email_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2563eb;">Спасибо за ваш заказ!</h2>
        <p>Ваша заявка успешно принята.</p>
        
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Номер заказа: <span style="color: #2563eb;">{order_number}</span></h3>
        </div>
        
        <h3>Параметры вашего заказа:</h3>
        <ul>
            <li><strong>Размеры:</strong> {body_data.get('length')} x {body_data.get('width')} x {body_data.get('height')} мм</li>
            <li><strong>Материал:</strong> {body_data.get('plastic')}</li>
            <li><strong>Цвет:</strong> {body_data.get('color')}</li>
            <li><strong>Заполнение:</strong> {body_data.get('infill')}%</li>
            <li><strong>Количество:</strong> {body_data.get('quantity')} шт</li>
        </ul>
        
        {'<h3>Описание:</h3><p>' + body_data.get('description', '') + '</p>' if body_data.get('description') else ''}
        
        <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Мы свяжемся с вами в течение 24 часов</strong> для уточнения деталей и расчета стоимости.</p>
        </div>
        
        <hr style="margin: 30px 0;">
        
        <p style="color: #666;">С уважением,<br>Команда 3D Print Custom</p>
        <p style="color: #666; font-size: 14px;">
            📧 zakaz@3dprintcustom.ru<br>
            📍 г. Москва, ул. Лобановский Лес, дом 11 (м. Прокшино)
        </p>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px;">Дата заказа: {datetime.now().strftime('%d.%m.%Y %H:%M')}</p>
    </body>
    </html>
    """
    
    msg_client = MIMEMultipart('alternative')
    msg_client['Subject'] = f'Ваш заказ на 3D печать №{order_number}'
    msg_client['From'] = smtp_user
    msg_client['To'] = body_data.get('email')
    msg_client.attach(MIMEText(client_email_body, 'html', 'utf-8'))
    
    ports_to_try = [587, 465, 25]
    last_error = None
    
    for port in ports_to_try:
        try:
            print(f"Trying SMTP: {smtp_server}:{port}")
            
            if port == 465:
                print("Using SSL connection (port 465)")
                with smtplib.SMTP_SSL(smtp_server, port) as server:
                    print("Logging in...")
                    server.login(smtp_user, smtp_password)
                    print("Sending emails...")
                    server.send_message(msg_company)
                    server.send_message(msg_client)
                    print(f"✅ Success with port {port}!")
                    break
            else:
                print(f"Using STARTTLS connection (port {port})")
                with smtplib.SMTP(smtp_server, port, timeout=10) as server:
                    server.starttls()
                    print("Logging in...")
                    server.login(smtp_user, smtp_password)
                    print("Sending emails...")
                    server.send_message(msg_company)
                    server.send_message(msg_client)
                    print(f"✅ Success with port {port}!")
                    break
        except (smtplib.SMTPException, OSError) as e:
            last_error = e
            print(f"❌ Port {port} failed: {type(e).__name__}: {str(e)}")
            continue
    else:
        print(f"All ports failed. Last error: {last_error}")
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'orderNumber': order_number,
                'message': f'Demo mode: All SMTP ports failed'
            })
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'orderNumber': order_number
        })
    }