# SketchToCode

http://127.0.0.1:5000/#/admin -> is the canvas (home page) route

http://127.0.0.1:5000/#/webpage -> is the rendered output page route

## Building the Application:

This project uses Python3.

1. Install python requirements and dependencies:
```
pip install -r requirements.txt
cd static
npm install
```

2. Build the front end:
```
npm run build
```
(You can use ```npm run watch``` to avoid building the front end everytime a change is made.)

3. Go to project root and run the server:
```
cd ..
python app.py
```

4. Go to ```localhost:5000/#/admin``` to view project.
5. Go to ```localhost:5000/#/webpage``` to view rendered output page.

