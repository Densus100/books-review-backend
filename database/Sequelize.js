const { Sequelize, DataTypes } = require('sequelize');


const connection = new Sequelize.Sequelize(process.env.DB_POSTGRES_DBNAME, 
  process.env.DB_POSTGRES_USERNAME, 
  process.env.DB_POSTGRES_PASSWORD, {
    host: process.env.DB_POSTGRES_HOST,
    port: process.env.DB_POSTGRES_PORT,
    dialect: 'postgres',
});
// create a new instance of sequelize


// connection.authenticate()
//   .then((_) => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });


const models = {
    Users: connection.define('Users', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
        },
        email_address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        // Foreign key for Role will be added by association
    }),
    Roles: connection.define('Roles', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        is_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }),
    Books: connection.define('Books', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        image_path: {
            type: DataTypes.STRING,
        },
        release_date: {
            type: DataTypes.DATE,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true, // Book is shown by default
        }
    }),
    Favorites: connection.define('Favorites', {
        // This is a join table, no extra fields needed unless you want to add more info
    }),
    Reviews: connection.define('Reviews', {
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        }
    })
}

// Define associations (Many Users belong to one Role)
models.Users.belongsTo(models.Roles, {
    foreignKey: {
        name: 'roleId',
        allowNull: true // Allow null for users without a role
    },
    as: 'role'
});
models.Roles.hasMany(models.Users, {
    foreignKey: 'roleId',
    as: 'users'
});

// Define one-to-many: User has many Favorites, each Favorite belongs to a Book
models.Users.hasMany(models.Favorites, {
    foreignKey: 'userId',
    as: 'favorites'
});
models.Favorites.belongsTo(models.Users, {
    foreignKey: 'userId',
    as: 'user'
});
models.Favorites.belongsTo(models.Books, {
    foreignKey: 'bookId',
    as: 'book'
});
models.Books.hasMany(models.Favorites, {
    foreignKey: 'bookId',
    as: 'favorites'
});

// Add associations for Reviews
models.Reviews.belongsTo(models.Users, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    as: 'user'
});
models.Users.hasMany(models.Reviews, {
    foreignKey: 'userId',
    as: 'reviews'
});
models.Reviews.belongsTo(models.Books, {
    foreignKey: {
        name: 'bookId',
        allowNull: false
    },
    as: 'book'
});
models.Books.hasMany(models.Reviews, {
    foreignKey: 'bookId',
    as: 'reviews'
});

module.exports.connection = connection;
module.exports.models = models;