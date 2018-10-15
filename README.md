# prueba-typeform
Prueba de aplicacion utilizando la API de TypeForm

Aplicacin que utiliza la API de TypeForm, se alimenta de la subida de un archivo en formato xls/xlsx donde se cargan datos de
los clientes que han utilizado los servicios de la empresa, a los cuales se les envía una encuesta con preguntas para captar la
experiencia del servicio en la atención, y otras consultas que varía según el tipo de servicio accedido.

# INSTALAR
```npm install```
# EJECUTAR
en ambas carpetas /server y /browser ejecutar:
```npm start```

server escucha en el puerto 3000 y server en el puerto 3001

# PRODUCCION
en la carpeta browser ejecutar ```npm run build```, luego en la carpeta server ejecutar npm start, ingresar en el navegador http://localhost:3001 para navegar en la aplicación. 

## Docker
puede ejecutar dockerizado, ejecutando en la raiz del proyecto:
```docker-compose up```
