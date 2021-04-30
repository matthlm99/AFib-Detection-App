% Visualize exported RR timestamps
%%
close all; clear all;
% load RR timestamps
RR_timestamps=csvread("RR_timestamps_2.csv");
peak_marker=ones(size(RR_timestamps));


figure(1);
scatter(RR_timestamps, peak_marker, 'LineWidth', 2);
title("Timestamps of measured R waves");
xlabel("Peak timing (ms)");
ylabel("Peak event");