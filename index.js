require("dotenv").config();
const express = require("express");
const app = express();
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
app.get("/api/tutorials", async (req, res, next) => {
    try {
        let tutorials;
        if (req.query.title) {
            tutorials = await Tutorial.find({
                title: new RegExp(req.query.title),
            });
        } else {
            tutorials = await Tutorial.find({});
        }
        res.json(tutorials);
    } catch (error) {
        next(error);
    }
});

// GET - find all published Tutorials
// GET - get tutorial by id
app.get("/api/tutorials/:id", async (req, res, next) => {
    try {
        let tutorials;
        if (req.params.id === "published") {
            tutorials = await Tutorial.find({ published: true });
        } else {
            tutorials = await Tutorial.findById(req.params.id);
        }
        res.json(tutorials);
    } catch (error) {
        next(error);
    }
});

// POST - add new tutorial
app.post("/api/tutorials", async (req, res, next) => {
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
    try {
        const savedTutorial = await tutorial.save();
        res.json(savedTutorial);
    } catch (error) {
        next(error);
    }
});

// PUT - update tutorial by id
app.put("/api/tutorials/:id", async (req, res, next) => {
    const body = req.body;
    if (!body.title) {
        return response.status(400).json({
            error: "Tutorial's title missing",
        });
    }

    const editedTutorial = {
        title: body.title,
        published: body.published,
        creators: body.creators,
        description: body.description,
    };
    try {
        const updatedTutorial = await Tutorial.findByIdAndUpdate(
            req.params.id,
            editedTutorial,
            {
                new: true,
            }
        );
        res.json(updatedTutorial);
    } catch (error) {
        next(error);
    }
});

// DELETE - remove tutorial by id
app.delete("/api/tutorials/:id", async (req, res, next) => {
    try {
        await Tutorial.findByIdAndRemove(req.params.id);
        res.send(204).end();
    } catch (error) {
        next(error);
    }
});

// DELETE - remove all tutorials
app.delete("/api/tutorials", async (req, res, next) => {
    try {
        await Tutorial.remove({});
        res.send(204).end();
    } catch (error) {
        next(error);
    }
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
