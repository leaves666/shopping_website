-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: shopping_website
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `catid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`catid`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'dystopia'),(2,'fairy tale'),(3,'novel'),(4,'science fiction'),(5,'comic books');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `pid` int NOT NULL AUTO_INCREMENT,
  `catid` int DEFAULT NULL,
  `catName` varchar(100) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text,
  `imagePlace` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`pid`),
  KEY `catid` (`catid`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`catid`) REFERENCES `categories` (`catid`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (2,1,'dystopia','1984',29.99,'1984, first published in 1948, is based on a dystopian vision of the future where the freedom of the individual is subjugated to the conformity of society. The novel focuses on Winston Smith, who works for the Ministry of Truth, a branch of the government responsible for the dissemination of information.','pics/product2.jpg'),(3,2,'fairy tale','Between Mermaids',39.99,'Between Mermaids is the latest collection of short stories by young and emerging writer Zhang Tianyi, including Cinderella\'s Dance, Between Mermaids, Twelve Changing Mothers and other representative short stories of Zhang Tianyi. The whole book deconstructs the creation form of classic fairy tales, reflecting the universal laws of love, marriage, family and life. The works are gorgeous, smart and humorous, with distinct recognition and strong personal style.','pics/product3.jpg'),(4,3,'novel','Our mutual friend',109.99,'Our Mutual Friend by Charles Dickens is a novel written during the mid-19th century. The story dives into the murky waters of society and human relationships through a tapestry of characters connected by themes of wealth, morality, and the struggles of life along the River Thames.','pics/product4.jpg'),(5,3,'novel','Oliver Twist',49.99,'Oliver Twist, a novel by Charles Dickens, published serially under the pseudonym “Boz” from 1837 to 1839 in Bentley’s Miscellany and in a three-volume book in 1838. The novel was the first of the author’s works to realistically depict the impoverished London underworld and to illustrate his belief that poverty leads to crime.','pics/product5.jpg'),(30,4,'science fiction','A Brief History of Time',29.90,'In A Brief History of Time, Hawking writes in non-technical terms about the structure, origin, development and eventual fate of the universe, which is the object of study of astronomy and modern physics. He talks about basic concepts like space and time, basic building blocks that make up the universe (such as quarks) and the fundamental forces that govern it (such as gravity). He writes about cosmological phenomena such as the Big Bang and black holes. He discusses two major theories, general relativity and quantum mechanics, that modern scientists use to describe the universe. Finally, he talks about the search for a unifying theory that describes everything in the universe in a coherent manner.','pics/1742319306497.jpg'),(36,5,'comic books','IRON MAN',18.80,'IRON MAN CAN SAVE THE WORLD','pics/1747152401769.jpeg'),(37,5,'comic books','Attack on Titan',199.00,'After his hometown is destroyed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.','pics/1747152577884.jpg'),(38,4,'science fiction','3 Body Problem',29.90,'3 Body Problem is an American science fiction television series created by David Benioff, D. B. Weiss and Alexander Woo. The third streaming adaptation of the Chinese novel series Remembrance of Earth','pics/1747152671032.jpeg'),(39,2,'fairy tale','Children tales',108.80,'Grimms&#x27; Fairy Tales, originally known as the Children&#x27;s and Household Taless a German collection','pics/1747152828823.jpeg'),(40,1,'dystopia','Brave new world',19.90,'The novel examines a futuristic society, called the World State, that revolves around science and efficiency. In this society, emotions and individuality are conditioned out of children at a young age','pics/1747184907431.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `admin_flag` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`userid`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@gmail.com','$2b$10$zxmEVlr55q4.in86Pper6O/rAJTbYMyV4FWhusiQBdD.5EAjt2nAu',1),(2,'user@gmail.com','$2b$10$jJ6xGtxDpkg5HArZ0w.CHuVrS506CtUwEAHTvaji0kleYNPgC3pvy',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-16 11:52:26
