import React, { useEffect, useState } from 'react'
import './testPage.css'
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function TestPage() {
    const [activeStep, setActiveStep] = useState(0);


    const stepOne = () => {
        return (
        <>
        <h1>Step One</h1>
        <form action="">
            <input type="text" name="stepOne" id="" />
            <button type='submit'>Next</button>
        </form>
        </>
    );
    }

    const stepTwo = () => {
        return (
            <>
            <h1>Step Two</h1>
            <form action="">
                <input type="text" name="stepTwo" id="" />
                <button type='submit'>Next</button>
            </form>
            </>
        );
    }

    const stepThree = () => {
        return (
            <>
            <h1>Step Three</h1>
            <form action="">
                <input type="text" name="stepThree" id="" />
                <button type='submit'>Next</button>
            </form>
            </>
        );
    }

    const steps = [
        {
            label: '',
            form: stepOne()
        },
        {
            label: '',
            form: stepTwo()
        },
        {
            label: '',
            form: stepThree()
        },
    ]

    const theme = useTheme();
    const maxSteps = steps.length;
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
      };
  
    return (
      <Box className='box-test' sx={{ maxWidth: 400, flexGrow: 1 }}>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: 100,
            pl: 2,
          }}
        >
        </Paper>
        <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
        >{steps.map((step, index) => (
          <div key={step.label}>
            {Math.abs(activeStep - index) <= 2 ? (
                <Box sx={{ height: 590, maxWidth: 380, width: '100%', p: 2 }}>
                    {steps[activeStep].form}
                 </Box>
            ) : null}
          </div>
        ))}
        </SwipeableViews>
        <MobileStepper
          variant="text"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              Next
              {theme.direction === 'rtl' ? (
                <KeyboardArrowLeft />
              ) : (
               <h2 className='next-button'>Next</h2>
              )}
            </Button>
          }
          backButton={
            <Button className='back-arrow'  size="small" color='primary' onClick={handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? (
                <KeyboardArrowRight />
              ) : (
                <ArrowBackIcon className='back-arrow' />
              )}
            </Button>
          }
        />
      </Box>
    );
  }


