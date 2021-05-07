% Visualize exported RR timestamps
%%
close all; clear all;
% load RR timestamps
FPS = 30;
red_waveform=csvread("red_waveform.csv");

figure(1);
plot(red_waveform(2, :), red_waveform(1, :), 'r');
title("Timestamps of measured R waves");
xlabel("Time(s)");
ylabel("Red Average(~mV)");
grid on;