import React, { useState, useRef, useEffect } from 'react';
import MainCard from '../../ui-component/cards/MainCard';
import { TextField, Button, Grid, Box, IconButton, Checkbox } from '@material-ui/core'; // Import Checkbox from Material UI
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import EditIcon from '@material-ui/icons/Edit';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import configData from '../../config';

const EditChapter = () => {
    const { id } = useParams();
    const history = useHistory();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [hovered, setHovered] = useState(false);
    const fileInputRef = useRef(null);
    const [errors, setErrors] = useState({}); // State to manage form errors

    const [questions, setQuestions] = useState([
        {
            question: "",
            choices: [{ choice: "", checked: false }, { choice: "", checked: false }] // Updated structure to include checkbox state
        }
    ]);

    const handleChangeQuestion = (e, index) => {
        const { name, value } = e.target;
        const updatedQuestions = [...questions];
        updatedQuestions[index][name] = value;
        setQuestions(updatedQuestions);
    };

    const handleChangeChoice = (e, qIndex, cIndex) => {
        const { name, value } = e.target;
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].choices[cIndex][name] = value; // Update choice value
        setQuestions(updatedQuestions);
    };

    const handleCheckboxChange = (qIndex, cIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].choices[cIndex].checked = !updatedQuestions[qIndex].choices[cIndex].checked; // Toggle checkbox state
        // Uncheck the other checkbox
        const otherIndex = cIndex === 0 ? 1 : 0;
        updatedQuestions[qIndex].choices[otherIndex].checked = !updatedQuestions[qIndex].choices[cIndex].checked;
        setQuestions(updatedQuestions);
    };


    const handleAddQuestion = () => {
        setQuestions([...questions, { question: "", choices: [{ choice: "", checked: false }, { choice: "", checked: false }] }]);
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);

        setQuestions(updatedQuestions);
    };

    const handleSubmit = () => {
        let formErrors = {};
        let hasErrors = false;

        let Lantern = localStorage.getItem('Lantern-account');
        let tokenObj = JSON.parse(Lantern);
        let token = tokenObj.token;

        // Your axios POST request logic here
    };

    return (
        <Grid container spacing={3}>
            {questions.map((q, qIndex) => (
                <Grid item xs={7} key={qIndex}>
                    <TextField
                        type="text"
                        name="question"
                        label={`Question ${qIndex + 1}`}
                        variant="outlined"
                        fullWidth
                        value={q.question}
                        style={{ marginBottom: "0.5rem", }}
                        onChange={(e) => handleChangeQuestion(e, qIndex)}
                    />
                    {q.choices.map((choice, cIndex) => (
                        <Grid container spacing={2} key={cIndex}>
                            <Grid item xs={7} marginTop={1}>
                                <TextField
                                    type="text"
                                    name="choice"
                                    label={`Choice ${cIndex + 1}`}
                                    variant="outlined"
                                    fullWidth
                                    value={choice.choice}
                                    onChange={(e) => handleChangeChoice(e, qIndex, cIndex)}
                                />
                            </Grid>
                            <Grid item xs={1} margin={1}>
                                <Checkbox
                                    checked={choice.checked}
                                    onChange={() => handleCheckboxChange(qIndex, cIndex)}
                                />
                            </Grid>
                        </Grid>
                    ))}
                    {questions.length > 1 && <Button style={{ marginTop: "1rem" }} variant="outlined" color="error" onClick={() => handleRemoveQuestion(qIndex)}>
                        -
                    </Button>}
                </Grid>
            ))}
            <Grid item xs={3} margin={1}>
                <Button variant="outlined" color="primary" onClick={handleAddQuestion}>
                    +
                </Button>
            </Grid>
            <Grid item xs={12}>
                <Button variant="outlined" color="primary" onClick={handleSubmit}>
                    Ajouter un Quizz
                </Button>
            </Grid>
        </Grid>
    );
};

export default EditChapter;
