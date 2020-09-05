require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Tutorial = require("./models/tutorial");
const { response } = require("express");

app.use(express.json());
const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};
app.use(requestLogger);

// GET - get all tutorials
/*
api/tutorials?title=kw
find all Tutorials which title contains 'kw'
*/
app.get("/api/tutorials", (req, res) => {
    if (req.query.title) {
        Tutorial.find({ title: new RegExp(req.query.title) })
            .then((tutorials) => {
                res.json(tutorials);
            })
            .catch((error) => {
                res.status(404).end();
            });
    } else {
        Tutorial.find({})
            .then((tutorials) => {
                res.json(tutorials);
            })
            .catch((error) => {
                res.status(404).end();
            });
    }
});

// GET - get tutorial by id
// GET - find all published Tutorials
app.get("/api/tutorials/:id", (req, res, next) => {
    if (req.params.id === "published") {
        Tutorial.find({ published: true })
            .then((filteredTutorial) => {
                res.json(filteredTutorial);
            })
            .catch((error) => {
                res.status(404).end();
            });
    } else {
        Tutorial.findById(req.params.id)
            .then((tutorial) => {
                res.json(tutorial);
            })
            .catch((error) => next(error));
    }
});

// POST - add new tutorial
app.post("/api/tutorials", (req, res) => {
    const body = req.body;

    if (!body.title) {
        return response.status(400).json({
            error: "Tutorial's title missing",
        });
    }

    const tutorial = new Tutorial({
        title: body.title,
        published: body.published,
        creators: body.creators.slice(),
        description: body.description,
    });

    tutorial
        .save()
        .then((savedTutorial) => {
            res.json(savedTutorial);
        })
        .catch((error) => {
            res.status(404).end();
        });
});

// PUT - update tutorial by id
app.put("/api/tutorials/:id", (req, res, next) => {
    const body = req.body;
    if (!body.title) {
        return response.status(400).json({
            error: "Tutorial's title missing",
        });
    }

    const editedTutorial = {
        title: body.title,
        published: body.published,
        creators: body.creators.slice(),
        description: body.description,
    };

    Tutorial.findByIdAndUpdate(req.params.id, editedTutorial, {
        new: true,
    })
        .then((updatedNote) => {
            res.json(updatedNote);
        })
        .catch((error) => next(error));
});

// DELETE - remove tutorial by id
app.delete("/api/tutorials/:id", (req, res, next) => {
    Tutorial.findByIdAndDelete(req.params.id)
        .then(() => {
            res.status(204).end();
        })
        .catch((error) => next(error));
});

// DELETE - remove all tutorials
app.delete("/api/tutorials", (req, res) => {
    Tutorial.remove({})
        .then(() => {
            res.status(204).end();
        })
        .catch((error) => {
            res.status(404).end();
        });
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
};

app.use(errorHandler);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
