package main

import (
	"api/router"
	"api/utils"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error al cargar archivo .env")
	}
	status := &utils.DownloadStatus{Status: make(map[string]utils.StatusResponse)}

	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowHeaders:     "Origin,Content-Type,Accept,Content-Length,Accept-Language,Accept-Encoding,Connection,Access-Control-Allow-Origin",
		AllowOrigins:     "*",
		AllowOriginsFunc: nil,
		AllowCredentials: false,
		AllowMethods: strings.Join([]string{
			fiber.MethodGet,
			fiber.MethodPost,
			fiber.MethodHead,
			fiber.MethodPut,
			fiber.MethodDelete,
			fiber.MethodPatch,
		}, ","),
		MaxAge: 3600,
	}))
	router.SetupRoutes(app, status)

	portString := os.Getenv("SERVER_PORT")

	app.Listen(":" + portString)
}
