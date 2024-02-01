# API REST para Blog 4 business

## Pre-requisitos
Para la instalación del API es necesario tener instalado:

*   Node.js version 18+.
*   MSSQL Server 2019+ (En caso de descargarlo en linux, es necesario tener instalado **docker** & **docker-compose**)

## Instalación SQL Server en Linux

Para tener instalado SQL Server en alguna distribución de linux basada en debian es necesario realizar los siguientes pasos en la consola:

1. Ejecutar el siguiente comando para descargar la imagen de docker: ```sudo docker pull mcr.microsoft.com/mssql/server:2022-latest```
2. Ejecutar el siguiente comando para configurar el docker: 
        
        sudo docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<Temporal.123>" \
        -p 1433:1433 --name sql1 --hostname sql1 \
        -d \
        mcr.microsoft.com/mssql/server:2022-latest
    
    Ten cuenta que el "MSSQL_SA_PASSWORD" debe de ser el mismo que vas a configurar en la aplicación

3. Ejecutar el siguiente comando para iniciar el docker: ```sudo docker start sql1```. Una ves iniciado el docker ya tienes acceso a **SQL Server** mediante los siguientes datos:
    
        user: 'sa'
        password: '<Temporal.123>'
        server: 'localhost'
        port: 1433

Para la interacción con SQL Server en el docker puedes usar lo siguiente:

*  Para conectarse al servicio de SQL Server se usa: ```/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "<Temporal.123>"```. Aquí debes poner la contraseña que configuraste en el paso 2 de la instalación. Ten en cuenta que para ejecutar alguna sentencia SQL mediante consola, es necesario ejecutar después de la sentencia el comando ```GO```.

*  Para errores podemos usar: ```docker exec -t sql1 cat /var/opt/mssql/log/errorlog | grep connection```


## Instalación del API en Desarrollo 🔧

1. Una vez tengamos el servicio de SQL Server, es necesario crear la DB, y lo podemos hacer con el siguiente comando: 
    
    ```CREATE DATABASE blog4business;```

2. Despues es necesario crear la tabla que utilizaremos para guardar los blogs en el sistema con la siguiente sentencia:

    ```
    CREATE TABLE post (id INT PRIMARY KEY IDENTITY(1,1), titulo NVARCHAR(150), autor NVARCHAR(150), fecha DATETIME, contenido TEXT);
    ```
    
    En caso de querer insertar un registro de ejemplo tenemos la siguiente query:
    
    ```
    INSERT INTO post (titulo, autor, fecha, contenido) VALUES ('Blog de ejemplo', 'Ernesto Troncoso', GETDATE(), '**Aquí** debería de ir una breve descripción del post que sea mucho mayor de _70 caracteres_ para ver como se comporta la vista de detalle del blog con pruebas de markdown');
    ```

3. Entrar en la carpeta api-4business del código y abrir una línea de comandos. En la consola ejecutar:

    ```
    npm install
    ```
4. Copiar el archivo **.env.dist** y crear uno nuevo como **.env** y configurar las variables de entorno. **Nota:** si seguiste los pasos anteriores con los mismos datos de los comandos, no es necesario cambiar nada. En caso contrario, es necesario cambiar los valores correspondientes.

5. Para iniciar el servidor del API, es necesario ejecutar:

    ```
    nodemon -r dotenv/config api.js
    ```
    En caso de que el comando anterior te haya dado errores, es necesario ejecutar: 
    
    ```
    sudo npm install -g --force nodemon
    ```
    Para instalar de manera global la herramienta y despues volver a ejecutar ```nodemon api.js```

6. El Servidor estará ejecutandose en la dirección [localhost:8090](http://localhost:8090). Para confirmar que esta funcionando puedes entrar a [http://localhost:8090/api/post](http://localhost:8090/api/post) y si insertaste el ejemplo del paso 2, podras ver algo como:
    ```
    [
        {
            "id": 1,
            "titulo": "Blog de ejemplo",
            "autor": "Ernesto Troncoso",
            "fecha": "2024-01-24T22:05:53.260Z",
            "contenido": "Aquí debería de ir una breve descripción del post"
        }
    }
    ```




        
