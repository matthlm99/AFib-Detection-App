% Visualize exported RR timestamps
%%
close all; clear all;
% load RR timestamps
RR_timestamps=csvread("RR_timestamps_2.csv");
peak_marker=zeros(size(RR_timestamps));
FPS = 30;


figure(1);
scatter(RR_timestamps/FPS, peak_marker, 'LineWidth', 2);
title("Timestamps of measured R waves");
xlabel("Peak timing (s)");
ylabel("Peak event");
grid on;