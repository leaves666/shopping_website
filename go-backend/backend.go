package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB

func initDB() {
	password := os.Getenv("DB_PASSWORD")
	var err error
	db, err = sql.Open("mysql", "root:"+password+"@tcp(127.0.0.1:3306)/shopping_website")
	if err != nil {
		fmt.Println("Error opening database:", err)

	}
	fmt.Println("MySQL connected...")
}

// 验证密码
func validatePassword(enteredPassword, storedHashedPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(storedHashedPassword), []byte(enteredPassword))
	return err == nil
}

// 清除指定名称的Cookie
func clearCookie(c *gin.Context, name string) {
	c.SetCookie(name, "", -1, "/", "", false, true)
}

// 登录处理函数
func login(c *gin.Context) {
	var loginData struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data"})
		return
	}

	var user struct {
		AdminFlag int    `db:"admin_flag"`
		UserID    int    `db:"userid"`
		Password  string `db:"password"`
	}
	err := db.QueryRow("SELECT admin_flag, userid, password FROM users WHERE email =?", loginData.Email).Scan(&user.AdminFlag, &user.UserID, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			clearCookie(c, "isAdmin")
			clearCookie(c, "userid")
			clearCookie(c, "islogin")
			c.JSON(http.StatusOK, gin.H{"message": "Invalid email or password", "redirectUrl": "./login.html"})
		} else {
			clearCookie(c, "isAdmin")
			clearCookie(c, "userid")
			clearCookie(c, "islogin")
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Database error"})
		}
		return
	}

	if !validatePassword(loginData.Password, user.Password) {
		clearCookie(c, "isAdmin")
		clearCookie(c, "userid")
		clearCookie(c, "islogin")
		c.JSON(http.StatusOK, gin.H{"message": "Invalid email or password", "redirectUrl": "./login.html"})
		return
	}

	// 设置Cookie
	c.SetCookie("isAdmin", fmt.Sprintf("%d", user.AdminFlag), 2*24*60*60, "/", "", true, true)
	c.SetCookie("userid", fmt.Sprintf("%d", user.UserID), 2*24*60*60, "/", "", true, true)
	c.SetCookie("islogin", "true", 2*24*60*60, "/", "", false, false)

	if user.AdminFlag == 1 {
		c.JSON(http.StatusOK, gin.H{"message": "Login successful", "redirectUrl": "./admin.html"})
	} else {
		c.JSON(http.StatusOK, gin.H{"message": "Login successful", "redirectUrl": "../index.html"})
	}
}
func main() {
	initDB()
	defer db.Close()

	r := gin.Default()
	r.POST("/login", login)

	// 启动服务器
	if err := r.Run(":8080"); err != nil {
		fmt.Println("Failed to start server:", err)
	}
	fmt.Println("Server running on port 8080")
}
