package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

var db *sql.DB

func init() {
	var err error
	dsn := "root:89511555@tcp(localhost:3306)/shopping_website"
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		panic(err)
	}
}

func main() {
	r := gin.Default()

	r.Use(corsMiddleware())
	r.GET("/api/categories", getCategories)
	r.GET("/api/products", getProducts)
	r.POST("/add-product", addProduct)
	r.POST("/edit-product", editProduct)
	r.POST("/add-category", addCategory)
	r.DELETE("/delete-product", deleteProduct)

	r.Run(":3000")
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}

func getCategories(c *gin.Context) {
	rows, err := db.Query("SELECT * FROM categories")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var category Category
		if err := rows.Scan(&category.ID, &category.Name); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		categories = append(categories, category)
	}
	c.JSON(http.StatusOK, categories)
}

func getProducts(c *gin.Context) {
	// 实现获取产品的逻辑
}

func addProduct(c *gin.Context) {
	// 实现添加产品的逻辑
}

func editProduct(c *gin.Context) {
	// 实现编辑产品的逻辑
}

func addCategory(c *gin.Context) {
	// 实现添加分类的逻辑
}

func deleteProduct(c *gin.Context) {
	// 实现删除产品的逻辑
}

type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
