# My-Todo API 📝

Welcome to the My-Todo API! This API allows users to manage their tasks efficiently, providing a robust backend solution for creating, reading, updating, and deleting to-do items.

## Table of Contents 📚

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [License](#license)
- [Contact](#contact)

## Features ✨

- Create, read, update, and delete tasks
- User authentication for secure access
- Session management for user convenience
- Responsive and easy-to-use API

## Technologies 💻

This project is built using:

- **Node.js** - JavaScript runtime
- **TypeScript** - Strongly typed programming language
- **MongoDB** - NoSQL database
- **Redis** (optional) - In-memory data structure store for caching

## Installation ⚙️

To get started with the My-Todo API, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/zdnemz/mytodo-api.git
   ```
2. Navigate to the project directory:
   ```bash
   cd to-do-list-api
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage 🚀

To run the API in development mode, use:

```bash
npm run dev
```

For building the project, run:

```bash
npm run build
```

## API Documentation 📖

Comprehensive API documentation is available in the `docs` folder, utilizing OpenAPI. This documentation provides detailed information about the API endpoints, request/response formats, and usage examples.

To access the documentation, navigate to the `docs` directory in the project:

```bash
cd docs
```

You can view the OpenAPI documentation by opening the appropriate file (e.g., `openapi.yaml`) in a compatible viewer or using tools like [Swagger UI](https://swagger.io/tools/swagger-ui/).

## API Endpoints 📡

Here are the available API endpoints:

### Authentication

- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/register` - User registration

### Tasks

- **GET** `/api/tasks` - Retrieve all tasks
- **POST** `/api/tasks` - Create a new task
- **GET** `/api/tasks/:id` - Retrieve a specific task
- **PUT** `/api/tasks/:id` - Update a specific task
- **DELETE** `/api/tasks/:id` - Delete a specific task

## License 📄

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact 📫

For any inquiries or issues, feel free to reach out:

[![GitHub - zdnemz](https://img.shields.io/badge/zdnemz-%23121011.svg?style=flat-square&logo=GitHub&logoColor=white)](https://github.com/zdnemz)
[![LinkedIn - zdnemz](https://img.shields.io/badge/zdnemz-%230077B5.svg?style=flat-square&logo=LinkedIn&logoColor=white)](https://www.linkedin.com/in/zdnemz/)
[![Twitter - zdanemz](https://img.shields.io/badge/zdnemz-%231DA1F2.svg?style=flat-square&logo=Twitter&logoColor=white)](https://twitter.com/zdanemz)
[![Instagram - zdnemz](https://img.shields.io/badge/zdnmez-%23E4405F.svg?style=flat-square&logo=Instagram&logoColor=white)](https://instagram.com/zdnemz)

---

Thank you for checking out the My-Todo API! Happy coding! 🎉
