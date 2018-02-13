%% loadfile and tuning
clc, close all, clear variables

seconds_tolerance = 0.001;
amplitude_tolerance = 0.008;
distribution_resolution = 60;
src_filename = 'sc20minutesidletest.mp3';

%% dataload 
[yWeb,Fs] = audioread(src_filename);
data = yWeb(:,1);
scaling =1000/Fs;

nSamples = numel(data);
timespace = (1:nSamples);
timespace = timespace*scaling;
%% test 1 
% check for difference in L/R channels

% 
% 
% figure(1)
% hold on
% plot(timespace,yWeb(:,1))
% title(strcat(src_filename,' left audio plot'))
% % xlabel('time [ms]')
% % ylabel('Signal Amplitude [lin scale]')
% 
% 
% diff = yWeb(:,1) - yWeb(:,2);
% 
% % 
% 
% figure(2)
% plot(timespace,diff)
% title(strcat(src_filename,' difference in L/R'))
% xlabel('time [ms]')
% ylabel('Signal Amplitude [lin scale]')



%% test 2 
% check for signal periodicity

stol= round(seconds_tolerance*Fs);
atol= amplitude_tolerance;

peak = 0;

dbg_tolflagcounter = 0;
dbg_peakcount=0;


counter = 0;

% there's the ciccia outta here
for t = 1+stol:numel(data)
    
    tolflag= sum( abs(data(t-stol:t-1)) > atol );
    
    dbg_tolflagcounter = dbg_tolflagcounter + tolflag;
    dbg_peakcount = dbg_peakcount + (abs(data(t)) > atol);
    
    if (   (tolflag==0) && (abs(data(t)) > atol)      )
        counter = counter+1;
        peak(counter) = t; %consider preallocating for speed
    end
end
%% PEAKPLOT

figure(3)
plot(peak)
title(strcat(src_filename,' peak timeplot'))
xlabel('peak number')
ylabel('time [ms]')



%% audioplot with peaks, WARNING: 
%  PLOTTING INCONSISTENT DATA MAY RESULT
%  IN CPU FLOOD WHEN PLOTTING THIS
% 
% 
% for i = 1:counter
% waitbar(i/counter)
% figure(1)
% plot(peak(i)*ones(10,1),linspace(-1,1,10),'r')
% end

%
%% time interval distribution plot

nbins = distribution_resolution;

for i = 2:counter
delta(i-1) = peak(i)-peak(i-1);
end

[yData, xData] =  hist(delta*scaling,nbins);

figure(4)
hold on
hist(delta*scaling,nbins)


%% a gaussian plot
f = fit(xData.',yData.','gauss1')
figure(4)
plot(f)
title(strcat(src_filename,' peak distribution'))
xlabel('\Delta T_{peaks} [ms]')
ylabel('Occurrences')
