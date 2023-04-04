from flask import Flask, render_template, jsonify, request, make_response
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import jwt

app = Flask(__name__)

# .env파일 로드
load_dotenv()

# DB 연결
client = MongoClient(os.getenv('MONGO_URL'), 27017)
db = client.junglequiz

# HTML
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/signup', methods=['GET'])
def getSignupPage():
    return render_template('signup.html')


@app.route('/signin', methods=['GET'])
def getLoginPage():
    return render_template('signin.html')

@app.route('/new-quiz')
def editor():
    return render_template('quiz-editor.html')

@app.route('/test')
def quiz():
    return render_template('quiz.html')

@app.route('/result')
def result():
    return render_template('submit.html')

# User APIs


@app.route('/api/signin', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    encoded_jwt = jwt.encode({'userId': 'abc'}, "secret", algorithm="HS256")
    print(encoded_jwt)

    resp = make_response()
    resp.set_cookie('jwt_auth', encoded_jwt)

    return resp


# Quiz APIs

@app.route("/api/problems", methods=["GET"])
def get_problems():
    category = request.args.get('category')
    count = request.args.get('count')

    pipeline = [
        {"$sample": {"$size": count}},
        {"$match": {"category": category}}
    ]

    problems = db.problems.aggregate(pipeline)
    return problems

@app.route('/api/problems', methods=["POST"])
def create_problem():
    return "test"
    problem_data = request.get_json()
    db.problems.insert_one(problem_data)
    return {"success": True}

@app.route('/api/solved_problems', methods=["POST"])
def quiz_grading():
    return 'quiz grading'

if __name__ == '__main__':
    app.run('0.0.0.0', port=5050, debug=True)
