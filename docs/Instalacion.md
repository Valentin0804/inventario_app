# 🛠 Instalación y Configuración del Proyecto

## Requisitos
- Node.js 20+
- Angular CLI
- MySQL Server
- Git
- Postman o Thunder Client para pruebas

---

## Clonar repositorio

```bash
git clone https://github.com/Valentin0804/inventario_app.git
cd inventario-app

## Instalar backend

cd backend
npm install

## Configurar .env

DB_NAME=inventario_app
DB_USER=root
DB_PASSWORD= XXXX
DB_HOST=localhost
DB_DIALECT=mysql
JWT_SECRET= XXXXX

ACCESS_TOKEN= XXXXXXXXX

## Instalar Frontend
cd ../frontend
npm install
ng serve -o
