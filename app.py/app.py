from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "Accueil"

@app.route("/carbone")
def carbone():
    return render_template("carbone.html")

@app.route("/save_carbon", methods=["POST"])
def save_carbon():
    data = request.get_json()

    mois = data.get("mois")
    lignes = data.get("lignes")

    print("Mois :", mois)
    print("Lignes :", lignes)

    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True)