package router

import (
	filesHandlers "api/internal/handlers/files"
	"api/utils"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, status *utils.DownloadStatus) {
	api := app.Group("/api")

	api.Post("/download", func(ctx *fiber.Ctx) error {
		return filesHandlers.HandleDownload(ctx, status)
	})

	api.Post("/download/add", func(ctx *fiber.Ctx) error {
		return filesHandlers.HandleAddURLs(ctx, status)
	})

	api.Get("/status", func(ctx *fiber.Ctx) error {
		return filesHandlers.HandleStatus(ctx, status)
	})

	api.Get("/queue/clean", func(ctx *fiber.Ctx) error {
		return filesHandlers.HandleQueueClean(ctx, status)
	})
}
