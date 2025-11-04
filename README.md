# 📝 Todo App – Full Stack CI/CD Deployment on AWS EC2

This project is a **Full-Stack Todo Application** built with **React (frontend)** and **Node.js + Express (backend)**.  
It demonstrates a **real-world CI/CD pipeline** using **GitHub Actions**, deploying automatically to an **AWS EC2 Ubuntu instance** via **Nginx** and **PM2**.

---

## 🚀 Features

✅ Add, view, and delete todo tasks  
✅ RESTful API built with Node.js + Express  
✅ CI/CD with GitHub Actions  
✅ Reverse proxy setup via Nginx  
✅ Persistent backend process using PM2  
✅ Deployed on AWS EC2 (Ubuntu)

---

## 🧩 Tech Stack

**Frontend:** React.js  
**Backend:** Node.js + Express  
**Server:** AWS EC2 (Ubuntu 22.04)  
**Process Manager:** PM2  
**Reverse Proxy:** Nginx  
**CI/CD:** GitHub Actions

---

## 🛠️ Local Setup

### 1️⃣ Clone the repo
git clone https://github.com/<YOUR_USERNAME>/todo-ci-cd-ubuntu.git
cd todo-ci-cd-ubuntu

## 2️⃣ Install dependencies
# Backend
cd server
npm install

# Frontend
cd ../client
npm install

## 3️⃣ Run locally
cd server
npm start

cd client
npm start

Your frontend will run on:
👉 http://localhost:3000

Your backend will run on:
👉 http://localhost:5000

| Method | Endpoint       | Description     |
| ------ | -------------- | --------------- |
| GET    | /api/todos     | Get all todos   |
| POST   | /api/todos     | Create new todo |
| DELETE | /api/todos/:id | Delete a todo   |

----

<img width="1320" height="604" alt="1" src="https://github.com/user-attachments/assets/cbd93483-9f5a-4d01-99aa-543a6b684cb8" />


<img width="731" height="556" alt="2" src="https://github.com/user-attachments/assets/db1edb13-99c2-4755-a71d-43c406b91054" />

### ☁️ Deployment Guide (AWS EC2 + Nginx + PM2)
## 1️⃣ Setup Ubuntu EC2 Instance
# Update packages
sudo apt update && sudo apt upgrade -y

<img width="957" height="670" alt="3" src="https://github.com/user-attachments/assets/231f0aa7-2e86-4a3e-a4ee-c41732d5da3f" />

# Install Node.js & PM2
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs git build-essential
sudo npm install -g pm2

<img width="1105" height="674" alt="4" src="https://github.com/user-attachments/assets/e8ce7c2d-4975-4a31-bbd5-4db04ca7fc3f" />


<img width="1320" height="605" alt="8" src="https://github.com/user-attachments/assets/08d7164b-906b-43c8-9d56-750a8ab86e8a" />

## 2️⃣ Clone your repo on EC2
git clone https://github.com/<YOUR_USERNAME>/todo-ci-cd-ubuntu.git
cd todo-ci-cd-ubuntu

## 3️⃣ Run backend with PM2
cd server
pm2 start server.js --name todo-backend

## 4️⃣ Build frontend and configure Nginx
cd ../client
npm run build
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/default  --> 
server {
    listen 80;
    server_name _;
    
    root /home/ubuntu/todo-ci-cd-ubuntu/client/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:5000/;
    }
}

 Then:

sudo systemctl restart nginx
sudo systemctl enable nginx

Visit 👉 http://<EC2_PUBLIC_IP> in your browser.

<img width="797" height="538" alt="77" src="https://github.com/user-attachments/assets/6df58d2e-4863-4d64-9dd3-544c8b3a5958" />


<img width="1152" height="685" alt="66" src="https://github.com/user-attachments/assets/b988364f-49fe-4472-a7f9-becfff3932f3" />


<img width="1323" height="600" alt="9" src="https://github.com/user-attachments/assets/5902cd31-13f4-441f-af05-fa618a05f5f7" />

----

###  🤖 CI/CD with GitHub Actions
## 1️⃣ Add Secrets in GitHub
Go to Settings → Secrets → Actions and add:

| Name             | Description              |
| ---------------- | ------------------------ |
| `EC2_HOST`       | Your EC2 public IP       |
| `EC2_USER`       | SSH user (e.g., ubuntu)  |
| `EC2_SSH_KEY`    | Private SSH key contents |
| `MONGO_URI_TEST` | (optional) test DB URI   |

<img width="1334" height="499" alt="7" src="https://github.com/user-attachments/assets/d7b3be10-d355-4cd2-96eb-caefb7d68437" />


<img width="1328" height="602" alt="6" src="https://github.com/user-attachments/assets/d5a6b904-6378-4dd3-8729-7bcdccc8048c" />

## 2️⃣ Workflow file

Path: .github/workflows/deploy.yml
This workflow:
Runs tests
Builds frontend
SSHs into EC2
Pulls latest code
Restarts PM2 and Nginx

<img width="1325" height="625" alt="5" src="https://github.com/user-attachments/assets/399c83d4-cee1-4d32-9f1b-a30bcf82db1b" />


<img width="1079" height="582" alt="88" src="https://github.com/user-attachments/assets/c6c67c9c-609a-4405-8032-b4507d8f4f97" />


----

✅ Testing
## Backend test:
curl -i http://<EC2_IP>/api/todos

<img width="1186" height="580" alt="100" src="https://github.com/user-attachments/assets/4938e7fb-5965-41b9-9e2c-cb0e7583c1e1" />


<img width="1294" height="649" alt="97" src="https://github.com/user-attachments/assets/87477594-9e31-47fe-adf8-746fc24a5df6" />


-----


Frontend test:
Open browser → http://<EC2_IP> → add a new todo → verify it appears.

### 💡 Key Learnings
Automated CI/CD pipeline using GitHub Actions
Reverse proxy setup with Nginx
Persistent Node.js app using PM2
Secure deployment workflow on AWS EC2

----


### 👩‍💻 Author

Achini Thathsarani

💼 Software Developer | Software Engineering Student

🌐 LinkedIn Profile - https://www.linkedin.com/in/achini-thathsarani-91366a223/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BOKApwElYSQGglSmbgUgiNw%3D%3D






