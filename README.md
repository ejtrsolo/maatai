# APP Descarga de archivos en GO con React

Aplicación de gestión de descargas simultaneas 

## Pre-requisitos de instalación 🔧
Para la instalación de la aplicación es necesario tener instalado:

*   Instalar docker (en linux se encuentra como docker-ce)
*   Instalar docker-compose
*   Instalar make (en windows: https://parzibyte.me/blog/2020/12/30/instalar-make-windows/) (en linux: ```sudo apt-get update && sudo apt-get install make```)

## Instalación 🔧

Para la instalación en entorno de desarrollo es necesario:

1. Dentro de las carpetas __**api**__ y __**frontend**__, se encuentran unos archivos llamados **.env.dist**. Es necesario copiar el archivo **.env.dist** y crear uno nuevo como **.env** en cada una de las carpetas.

2. Abrir una consola en projecto y ejecutar: 
    ```
    docker-compose up --build -d
    ```

3. Una vez terminado el proceso, verificaremos que nuestra API este funcionando en [http://localhost:8080/api/status](http://localhost:8080/api/status). Tendrán que ver una respuesta como:
    ```
    {
        "status": "success",
        "message": "OK"
    }
    ```

4. Una vez confirmado el paso anterior, procederemos a dar de alta el frontend. Para esto en la consola que abrimos en el paso 2, ejecutaremos el siguiente comando:
    ```
    make start
    ```
    Obtendremos en pantalla algo como esto:
    ```
    docker-compose up -d
    react_frontend is up-to-date
    go_backend is up-to-date
    docker exec -it react_frontend sh -c "npm run devh"

    > frontend@0.0.0 devh
    > vite --host


        VITE v5.0.12  ready in 519 ms

        ➜  Local:   http://localhost:5173/
        ➜  Network: http://172.26.0.2:5173/
        ➜  press h + enter to show help
    ```
5. Abrir un navegador y poner cualquiera de las dos URLs que aparecieron en la consola: Ejemplo [http://172.26.0.2:5173/](http://172.26.0.2:5173/)

## Instrucciones de uso

Para ver las instrucciones de uso, abrir archivo README.md en [frontend/README.md](frontend/README.md)

## DEMO Live

Para ver el demo en vivo da clic (aquí)[https://current-download-react.onrender.com/]

Para ver el API en vivo da clic (aquí)[https://current-download-go.onrender.com/api/status]

## Construido con 🛠️

_Las herramientas utilizadas en este proyecto son:_

* [Vite](https://vitejs.dev/) - Entorno de desarrollo para frontend
* [React](https://es.react.dev/) - Framework de frontend usado
* [Go](https://go.dev/) - Framework de backend (API) usado
* [Fiber](https://gofiber.io/) - Framework web para GO

## Autor ✒️

* **Ernesto Troncoso** - *Trabajo Inicial* y *Documentación* - [ejtrsolo](https://www.linkedin.com/in/ernesto-jacobo-troncoso-de-la-riva-977182219/)