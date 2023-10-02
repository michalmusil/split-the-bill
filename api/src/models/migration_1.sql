CREATE DATABASE IF NOT EXISTS Split_the_bill;

CREATE TABLE `Users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(500) NOT NULL,
  `passwordHash` varchar(1000) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `isDeleted` BOOLEAN NOT NULL DEFAULT false, 
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
);

CREATE TABLE `Shoppings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `dueDateTime` datetime DEFAULT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `creatorId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `creatorId` (`creatorId`),
  CONSTRAINT `Shoppings_ibfk_1` FOREIGN KEY (`creatorId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `Products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(500) NOT NULL,
  `imagePath` varchar(1000) DEFAULT NULL,
  `description` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `creatorId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `creatorId` (`creatorId`),
  CONSTRAINT `Products_ibfk_1` FOREIGN KEY (`creatorId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `Users_shoppings` (
  `userId` int NOT NULL,
  `shoppingId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`userId`,`shoppingId`),
  UNIQUE KEY `Users_shoppings_shoppingId_userId_unique` (`userId`,`shoppingId`),
  KEY `shoppingId` (`shoppingId`),
  CONSTRAINT `Users_shoppings_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Users_shoppings_ibfk_2` FOREIGN KEY (`shoppingId`) REFERENCES `Shoppings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `Shoppings_products` (
  `shoppingId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL,
  `unitPrice` double,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`shoppingId`,`productId`),
  UNIQUE KEY `Shoppings_products_productId_shoppingId_unique` (`shoppingId`,`productId`),
  KEY `productId` (`productId`),
  CONSTRAINT `Shoppings_products_ibfk_1` FOREIGN KEY (`shoppingId`) REFERENCES `Shoppings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Shoppings_products_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `Purchases` (
  `userId` int NOT NULL,
  `shoppingId` int NOT NULL,
  `productId` int NOT NULL,
  `quantity` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`userId`,`shoppingId`,`productId`),
  UNIQUE KEY `Purchases_productId_userId_shoppingId_unique` (`userId`,`productId`, `shoppingId`),
  CONSTRAINT `Purchases_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Purchases_ibfk_2` FOREIGN KEY (`shoppingId`) REFERENCES `Shoppings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Purchases_ibfk_3` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);