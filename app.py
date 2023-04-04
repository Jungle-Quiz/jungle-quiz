from flask import Flask, render_template, jsonify, request, make_response, redirect
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os
import jwt
import re
import json

app = Flask(__name__)

# .env파일 로드
load_dotenv()

# DB 연결
client = MongoClient(os.getenv('MONGO_URL'), 27017)
db = client.junglequiz


permitAllResources = ['/static/*', '/signin', '/signup']

@app.before_request
def before_request():
    path = request.path
    
    canPass = False

    for pr in permitAllResources:
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
    p = re.compile(pr)
    ret = p.match(path)
    if ret != None and ret.start() == 0:
        return True
    else:
        return False
# HTML

@app.route('/')
def home():
    user = request.user
    print(user)
    return render_template('home.html')


@app.route('/signup', methods=['GET'])
def getSignupPage():
    return render_template('signup.html')


@app.route('/signup', methods=['POST'])
def signup():
    username = request.form['username']
    password = request.form['password']
    pwcheck = request.form['pwcheck']

    if username == None or username == '':
        return render_template('signup.html', error='username', msg='Username is required')

    if password == None or password == '':
        return render_template('signup.html', error='password', msg='Password is required')

    if pwcheck != password:
        return render_template('signup.html', error='pwcheck', msg='Pwcheck must same password')

    # 중복 체크
    user = db.users.find_one({'username': username})
    if user != None:
        return render_template('signup.html', error='username', msg='username must not be duplicated.')

    db.users.insert_one({'username': username, 'password': password})

    return redirect('/')


@app.route('/signin', methods=['GET'])
def getLoginPage():
    return render_template('signin.html')


@app.route('/signin', methods=['POST'])
def login():
    # validation
    username = request.form['username']
    password = request.form['password']

    if username == None or username == '':
        return render_template('signin.html', error='username', msg='Username is required')

    if password == None or password == '':
        return render_template('signin.html', error='password', msg='Password is required')

    # 인증
    user = db.users.find_one({'username': username})

    if user == None:
        # error
        return render_template('signin.html', error='username', msg='this username not exists')

    if user['password'] != password:
        # error
        return render_template('signin.html', username=username,
                               error='password', msg='password is not valid')

    encoded_jwt = jwt.encode({'userId': str(user['_id'])}, "secret", algorithm="HS256")
    print(encoded_jwt)

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
    return render_template('submit.html')

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
        {"$match": {"category": category}}
    ]

    problems = list(db.problems.aggregate(pipeline))

    result = []
    for problem in problems:
        problem['_id'] = str(problem['_id'])
        result.append(problem)

    return jsonify({'problems': result})


@app.route('/api/problems', methods=["POST"])
def create_problem():
    print(request.user)
    print(request.user["_id"])
    user_id = request.user["_id"]
    problems = request.get_json()['problems']
    
    for problem in problems:
        problem['user'] = user_id

    db.problems.insert_many(problems)
    return {"success": True}


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
        pidAnswerMapper[id] = answers[idx]
        
    problems = list(db.problems.find({'_id': {'$in': poids}}))
    
    solved_problems = []
    
    for p in problems:
        p['_id'] = str(p['_id'])
        answer = pidAnswerMapper[p['_id']]
        solved_problems.append({'problem': json.dumps(p), 'answer' : answer, 'correct' : answer == p['answer']})

    return jsonify(solved_problems)


if __name__ == '__main__':
    app.run('0.0.0.0', port=5050, debug=True)
