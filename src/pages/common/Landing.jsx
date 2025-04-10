import React, { useRef, useEffect } from 'react';
import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';

const MotionButton = motion(Button);
const MotionBox = motion(Box);

const Landing = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const scrollTargetRef = useRef(null);
    const bgControls = useAnimation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const bounceAnimation = {
        y: [10, -18, 10],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: 'beforeChildren',
                staggerChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 12,
            },
        },
    };

    const logoSrc = theme.palette.mode === 'dark'
        ? '/logo-removebg-preview.png'
        : '/logo-removebg-invert.png';

    const handleLoginScroll = async () => {
        const isDark = theme.palette.mode === 'dark';

        await bgControls.start({
            backgroundImage: isDark
                ? 'linear-gradient(135deg, #1a1a1a, #414178)'
                : 'linear-gradient(135deg, #595992, #C2C1FF)',
            transition: {
                duration: 1.5,
                ease: 'easeInOut',
            }
        });

        scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => navigate('/login'), 1200);
    };

    return (
        <>
            <MotionBox
                animate={bgControls}
                transition={{ duration: 1 }}
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme.palette.background.default,
                    px: 2
                }}
            >
                <Container
                    maxWidth="sm"
                    sx={{
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4
                    }}
                >
                    <Box
                        component={motion.div}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        sx={{ width: '100%' }}
                    >
                        {/* Logo */}
                        <Box
                            component={motion.div}
                            variants={itemVariants}
                            sx={{ mb: 6, width: '100%', maxWidth: 350, mx: 'auto' }}
                        >
                            <img
                                src={logoSrc}
                                alt="1Bank Logo"
                                style={{ width: '100%', height: 'auto' }}
                            />
                        </Box>

                        {/* Text */}
                        <Box component={motion.div} variants={itemVariants}>
                            <Typography
                                variant="h2"
                                fontWeight={700}
                                sx={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', mb: 1 }}
                            >
                                Welcome to 1Bank
                            </Typography>
                            <Typography
                                variant="h5"
                                color="text.secondary"
                                sx={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}
                            >
                                Reliable. Agile. Forward-thinking.
                            </Typography>
                        </Box>

                        {/* Button */}
                        <MotionButton
                            animate={bounceAnimation}
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.96 }}
                            variants={itemVariants}
                            variant="contained"
                            size="large"
                            onClick={handleLoginScroll}
                            sx={{
                                mt: 5,
                                px: 5,
                                py: 1.5,
                                fontSize: 'clamp(1rem, 1.4vw, 1.3rem)',
                                fontWeight: 700,
                                borderRadius: '30px',
                                textTransform: 'none',
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.getContrastText(theme.palette.primary.main),
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    backgroundColor:
                                        theme.palette.mode === 'dark'
                                            ? theme.palette.primary.light
                                            : theme.palette.primary.dark,
                                    color: theme.palette.getContrastText(
                                        theme.palette.mode === 'dark'
                                            ? theme.palette.primary.light
                                            : theme.palette.primary.dark
                                    ),
                                    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            Login to Dashboard
                        </MotionButton>
                    </Box>
                </Container>
            </MotionBox>

            <Box ref={scrollTargetRef} sx={{ height: '100vh' }} />
        </>
    );
};

export default Landing;