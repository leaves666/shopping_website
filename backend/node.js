const express = require('express');
const https = require('https');
const mysql = require('mysql2');
const helmet = require('helmet');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const sharp = require("sharp");
const app = express();
const port = 3000;
const { body, validationResult } = require('express-validator');
const DOMPurify = require('isomorphic-dompurify');
const { JSDOM } = require('jsdom');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken'); // For token generation
const adminRoutes = require("./routes/router");
app.use(cookieParser());
// Helmet middleware for security
app.use(helmet());

// Content Security Policy settings
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'","https://code.jquery.com/jquery-3.5.1.min.js","https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js","https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js","https://cdn.tailwindcss.com/","https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.js"], // Adjust according to your needs
        styleSrc:["'self'", "'unsafe-inline'","'https://cdn.jsdelivr.net/npm/flowbite@3.1.2/dist/flowbite.min.css'","'https://fonts.googleapis.com/css?family=Roboto|Varela+Round|Open+Sans'","'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css'","'https://fonts.googleapis.com/icon?family=Material+Icons'","'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'"],
	objectSrc: ["'none'"],
        scriptSrcAttr:["'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        upgradeInsecureRequests: [], // Automatically upgrade HTTP to HTTPS
    },
}));
function generateAuthToken() {
    return crypto.randomBytes(64).toString('hex'); // Generate a secure random token
}

app.use("/", adminRoutes); // 挂载 admin 路由
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('assets')); 

app.use(cors({ 
    origin: "https://localhost",
    credentials: true, 
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname,'..', 'assets', 'pics');
        fs.existsSync(dir) || fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '89511555',
    database: 'shopping_website',
port: 3306, // 明确指定端口
  insecureAuth: true, // 如果使用旧版认证
waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  connectTimeout: 10000 // 10秒
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Get Categories
app.get('/api/categories', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
        console.log("get the categories");
    });
});


// Get Products

app.get('/api/products', (req, res) => {
    let query = 'SELECT * FROM products';
    const cId = req.query.category;
    const pId = req.query.productId;
    let queryParams = [];
     // If categoryId is provided, filter products by category
     if (cId) {
        query += ' WHERE catid = ?';
        queryParams.push(cId);
    }
    if (pId) {
        query += ' WHERE pid = ?';
        queryParams.push(Number(pId));
    }


    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send(err);
        }
        const sanitizedResults = sanitizeOutput(results);
        res.json(sanitizedResults);
        console.log("get the products");
      
    });
});


// Validate and sanitize input for adding a product
app.post("/add-product", upload.single("image"), [
    body('name').trim().escape().notEmpty().withMessage('Name is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('description').trim().escape().optional(),
    body('catid').isNumeric().withMessage('Category ID must be a number'),
    body('catName').trim().escape().optional(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { name, price, description,catid, catName } = req.body;
        let imagePath = null;

        if (req.file) {
            const originalPath = path.join(__dirname, "..", "assets", "pics", req.file.filename);
            const resizedPath = originalPath; // Keep the same path, overwrite the file

            // Resize the image while keeping its original format
            await sharp(originalPath)
                .resize(800, 600, { fit: "inside" }) // Resize to max 800x600, maintaining aspect ratio
                .toBuffer()
                .then((data) => fs.writeFileSync(resizedPath, data));

            // Save only the relative path in the database
            imagePath = `pics/${req.file.filename}`;
        }

        // Save product details in the database
        const sql = "INSERT INTO products (name, price, description, imagePlace,catid,catName) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [name, price, description, imagePath,catid, catName], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Database error" });
            }
            res.json({ message: "Product added successfully!", id: result.insertId });
        });

    } catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({ message: "Error processing image" });
    }
});

// Validate and sanitize input for editing a product
app.post("/edit-product", upload.single("image"), [
    body('name').trim().escape().optional(),
    body('price').isNumeric().optional(),
    body('description').trim().escape().optional(),
    body('catid').isNumeric().optional(),
    body('catName').trim().escape().optional(),
    body('pid').isNumeric().withMessage('Product ID must be a number').notEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, price, description,catid, catName , pid} = req.body;
    let imagePath = null;
    // Build dynamic SQL query
    let fieldsToUpdate = [];
    let values = [];
        
    if (req.file) {
       
        fieldsToUpdate.push("imagePlace = ?");
        values.push(`pics/${req.file.filename}`);
        
        const productId = pid;
        const searchsql="SELECT imagePlace FROM products WHERE pid = ?";
        db.query(searchsql, [productId], (err,result) => {
           if (err) {
               console.error(err);
               return res.status(500).send('Database error');
           }
              // Construct the image path
           
           const imagePath = path.join(__dirname,'..', 'assets', result[0].imagePlace);
            // Delete the origin image file
            fs.unlink(imagePath, (err) => {
               if (err) {
                   console.error("Error deleting image:", err);
                   return res.status(500).json({ message: "Error deleting image" });
               }
           });
   
        })
        const originalPath = path.join(__dirname, "..", "assets", "pics", req.file.filename);
        const resizedPath = originalPath; // Keep the same path, overwrite the file

        // Resize the image while keeping its original format
        await sharp(originalPath)
            .resize(800, 600, { fit: "inside" }) // Resize to max 800x600, maintaining aspect ratio
            .toBuffer()
            .then((data) => fs.writeFileSync(resizedPath, data));

        
    }


    // Check each field and only add non-null, non-undefined values
    if (name !== undefined && name !== null) {
        fieldsToUpdate.push("name = ?");
        values.push(name);
    }
    if (price !== undefined && price !== null) {
        fieldsToUpdate.push("price = ?");
        values.push(price);
    }
    if (description !== undefined && description !== null) {
        fieldsToUpdate.push("description = ?");
        values.push(description);
    }
    if (catid !== undefined && catid !== null) {
        fieldsToUpdate.push("catid = ?");
        values.push(catid);
    }
    if (catName !== undefined && catName !== null) {
        fieldsToUpdate.push("catName = ?");
        values.push(catName);
    }

    // Ensure there's something to update
    if (fieldsToUpdate.length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
    }
   
        // Final SQL query
    const sql = `UPDATE products SET ${fieldsToUpdate.join(", ")} WHERE pid = ?`;
    values.push(pid);
    console.log(sql,values)
    
    db.query(sql, values, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.send({ message: "Product modified successfully!" });
    });

        
});

// Validate and sanitize input for adding a category
app.post('/add-category', [
    body('name').trim().escape().notEmpty().withMessage('Category name is required'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const sql = 'INSERT INTO categories (name) VALUES (?)';
    db.query(sql, [name], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.send({ message: 'Category added successfully!' });
    });
});




app.delete('/delete-product', (req, res) => {
    const productId = req.query.productId;
    const searchsql="SELECT imagePlace FROM products WHERE pid = ?";
     db.query(searchsql, [productId], (err,result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
           // Construct the image path
        
        const imagePath = path.join(__dirname,'..', 'assets', result[0].imagePlace);
         // Delete the image file
         fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Error deleting image:", err);
                return res.status(500).json({ message: "Error deleting image" });
            }
        });

     })
    const sql = 'DELETE FROM products WHERE pid = ?';
    db.query(sql, [productId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.send({ message: 'Product deleted successfully!' });
      
    });
});

// Function to sanitize output
const sanitizeOutput = (data) => {
    if (Array.isArray(data)) {
        return data.map(item => {
            return {
                ...item,
                name: DOMPurify.sanitize(item.name),
                description: DOMPurify.sanitize(item.description),
                catName: DOMPurify.sanitize(item.catName)
            };
        });
    }
    return {
        ...data,
        name: DOMPurify.sanitize(data.name),
        description: DOMPurify.sanitize(data.description),
        catName: DOMPurify.sanitize(data.catName)
    };
};


// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Retrieve user from database
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length === 0 || !(await validatePassword(password, results[0].password))) {
            // Send a failure response
            return res.json({ message: 'Invalid email or password',redirectUrl: './login.html'  });
        }
        
        // Successful login
        // Create authentication token
       
        res.cookie('isAdmin', results[0].admin_flag.toString(), {
            httpOnly:true,
            secure: true,
            maxAge: 2 * 24 * 60 * 60 * 1000 
        });
        res.cookie('userid', results[0].userid, {
            httpOnly:true,
            secure: true,
            maxAge: 2 * 24 * 60 * 60 * 1000 
        });
        res.cookie('islogin', true ,{
            httpOnly:false,
            secure: false,
            maxAge: 2 * 24 * 60 * 60 * 1000 
        });
        
        if(results[0].admin_flag){

            res.status(200).json({ message: 'Login successful', redirectUrl: './admin.html' });
        }
        else
        res.status(200).json({ message: 'Login successful', redirectUrl: '../index.html' });
    });
});

app.post('/submit', (req, res) => {
    const { nonce } = req.body;
    if (nonce !== req.session.nonce) { 
        return res.status(403).send("CSRF token validation failed");
    }
    // Process the form
});

app.post('/logout', (req, res) => {
    res.clearCookie('isAdmin');
    res.clearCookie('userid');
    res.clearCookie('islogin');
    res.redirect('/');
});
app.post('/change-password', async (req, res) => {
    let values = [];
    const { email,password ,newPassword } = req.body;
        // Retrieve user from database
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        if (results.length === 0 || !(await validatePassword(password, results[0].password))) {
            // Send a failure response
            console.log(email,results,password,newPassword)
            return res.json({ message: 'Invalid email or password' , redirectUrl: '../index.html' });
        }

        // Successful validate
        userid=results[0].userid;
        pwd = await hashPassword(newPassword);
       res.clearCookie('auth_token'); 
        values.push(pwd)
        const sql = `UPDATE users SET  password = ? where userid = ?`;
        values.push(userid);
        db.query(sql, values, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Database error');
            }
            res.status(200).json({ message: 'changed successful', redirectUrl: '../index.html' });
        });

      
    });
 
    

});



// Function to hash a password
async function hashPassword(password) {
    const saltRounds = 10; // Cost factor
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword; // Store this in the database
}
async function validatePassword(enteredPassword, storedHashedPassword) {
    const match = await bcrypt.compare(enteredPassword, storedHashedPassword);
    return match; // Returns true if the password matches
}

app.use(express.static(path.join(__dirname, '../')));
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://localhost:3000;");
    next();
});
   const server=  app.listen(3000, ('0.0.0.0'),() => {
        console.log('HTTP Server running on port 3000');
    });

server.on('connection', (socket) => {
  socket.setTimeout(30 * 1000); // 30秒超时
  socket.on('timeout', () => {
    socket.destroy();
  });
});
