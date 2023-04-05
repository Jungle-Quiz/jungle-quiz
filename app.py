from flask import Flask, render_template, jsonify, request, make_response, redirect
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os
import jwt
import re
import json
import bcrypt

app = Flask(__name__)

# .env파일 로드
load_dotenv()

# bcrypt generate a salt
salt = bcrypt.gensalt()

# DB 연결
client = MongoClient(os.getenv('MONGO_URL'), 27017)
db = client.junglequiz


permitAllResourcesString = ['/static/*', '/signin', '/signup', '/logout']
permitAllResourcesPattern = []

@app.before_request
def before_request():
    path = request.path
    
    if path == '/logout':
        print('logout!!')
        resp = make_response(redirect('/login'))
        resp.delete_cookie('jwt_auth')
        return resp
    
    canPass = False

    for pr in permitAllResourcesPattern:
        if checkMatching(pr, path) == True:
            canPass = True
            break;

    if canPass == False:
        token = request.cookies.get('jwt_auth')
        if token == None:
            print("token is None, so redirect home page")
            return redirect('/signin')
        else:
            decoded_tkn = jwt.decode(token, "secret", algorithms=["HS256"])
            user = db.users.find_one({'_id': ObjectId(decoded_tkn['userId'])})
            request.user = user
    
    
def checkMatching(pr, path):
    ret = pr.match(path)
    if ret != None and ret.start() == 0:
        return True
    else:
        return False
# HTML

@app.route('/')
def home():
    user = request.user
    pipeline = [
        {
            '$group': {
                '_id': '$category',
                'count': {'$sum': 1}
            } 
        }
    ]
    problems = list(db.problems.aggregate(pipeline))
    
    return render_template('home.html', username=user['username'], problems=problems)


@app.route('/signup', methods=['GET'])
def getSignupPage():
    resp = make_response(render_template('signup.html'))
    resp.delete_cookie("jwt_auth")
    return resp


@app.route('/signup', methods=['POST'])
def signup():
    username = request.form['username'].strip()
    password = request.form['password'].strip()
    pwcheck = request.form['pwcheck'].strip()
    if username == None or username == '':
        return render_template('signup.html', error='username', msg='Username is required')
    
    if len(username.split()) > 1:
        return render_template('signup.html', error='username', msg='no withespace in the middle of username')

    if password == None or password == '':
        return render_template('signup.html', error='password', msg='Password is required')
    
    if len(password.split()) > 1:
        return render_template('signup.html', error='password', msg='no withespace in the middle of password')

    if pwcheck != password:
        return render_template('signup.html', error='pwcheck', msg='Pwcheck must same password')

    # 중복 체크
    user = db.users.find_one({'username': username})
    if user != None:
        return render_template('signup.html', error='username', msg='username must not be duplicated.')

    pw = password.encode('utf-8')
    hashed_pw = bcrypt.hashpw(pw, salt)

    db.users.insert_one({'username': username, 'password': hashed_pw})

    return redirect('/')


@app.route('/signin', methods=['GET'])
def getLoginPage():
    return render_template('signin.html')


@app.route('/signin', methods=['POST'])
def login():
    # validation
    username = request.form['username'].strip()
    password = request.form['password'].strip()

    if username == None or username == '':
        return render_template('signin.html', error='username', msg='Username is required')

    if password == None or password == '':
        return render_template('signin.html', username=username, error='password', msg='Password is required')

    # 인증
    user = db.users.find_one({'username': username})

    if user == None:
        # error
        return render_template('signin.html', error='username', msg='this username not exists')

    pw = password.encode("utf-8")
    hashed_pw = bcrypt.hashpw(pw, user['password'])
    
    if user['password'] != hashed_pw:
        # error
        return render_template('signin.html', username=username,
                               error='password', msg='password is not valid')

    encoded_jwt = jwt.encode({'userId': str(user['_id'])}, "secret", algorithm="HS256")

    resp = make_response(redirect('/'))
    resp.set_cookie('jwt_auth', encoded_jwt)
    return resp


@app.route('/new-quiz')
def editor():
    return render_template('quiz-editor.html')


@app.route('/quiz')
def quiz():
    return render_template('quiz.html')


@app.route('/result')
def result():
    return render_template('quiz-result.html')

# User APIs


# Quiz APIs

@app.route("/api/problems", methods=["GET"])
def get_problems():
    category = request.args.get('category')
    count = int(request.args.get('count'))

    print(category)
    print(type(count))

    pipeline = [
        {"$sample": {"size": count}},
        {"$match": {"category": category}},
        {"$project": {"user": 0}}
    ]

    problems = list(db.problems.aggregate(pipeline))

    result = []
    for problem in problems:
        problem['_id'] = str(problem['_id'])
        result.append(problem)
    print(result)
    
    return jsonify({'problems': result})


@app.route('/api/problems', methods=["POST"])
def create_problem():
    problems = request.get_json()['problems']
    for problem in problems:
        problem['answer'] = int(problem['answer'])
    db.problems.insert_many(problems)
    return {"success": True}

# 수정할 것
@app.route('/api/solved_problems', methods=["POST"])
def quiz_grading():
    user = request.user
    pids = request.get_json()['problems']
    answers = request.get_json()['answers']
    
    poids = []
    pidAnswerMapper = dict()
    
    for idx, id in enumerate(pids):
        oid = ObjectId(id)
        poids.append(oid)
        pidAnswerMapper[oid] = answers[idx]
        
    problems = list(db.problems.find({'_id': {'$in': poids}}))
    
    solved_problems = []
    correctCount = 0
    
    for p in problems:
        answer = pidAnswerMapper[p['_id']]
        correct = answer == p['answer']
        
        p['_id'] = str(p['_id'])
        solved_problems.append({'problem': p, 'answer' : answer, 'correct' : correct})
        correctCount += 1 if correct else 0

    return render_template('submit.html', solved_problems=solved_problems, correctCount=correctCount, total=len(pids))

if __name__ == '__main__':
    for ps in permitAllResourcesString:
        permitAllResourcesPattern.append(re.compile(ps))
    app.run('0.0.0.0', port=5050, debug=True)
