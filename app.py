from flask import Flask, render_template, jsonify, request
app = Flask(__name__)

# HTML을 렌더하는 방법


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/new-quiz')
def editor():
    return render_template('quiz-editor.html')

# GET API


@app.route('/test', methods=['GET'])
def test_get():
    title_receive = request.args.get('title_give')
    print(title_receive)
    return jsonify({'result': 'success', 'msg': '이 요청은 GET'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5050, debug=True)
