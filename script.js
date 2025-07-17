function handleInput() {
    const input = document.getElementById('userInput').value.trim();
    const output = document.getElementById('output');
    
    const split_by_dashes = input.split('---');
    // if less then 3 messages then to little to calc frequency
    if (split_by_dashes.length < 3) {
        output.textContent = 'Please enter at least three messages separated by "---".';
        return;
    }
    // Calculate frequency of each message
    // sec: 1721234567
    // nanosec: 123456789
    // ---
    // sec: 1721234568
    // nanosec: 987654321
    // ---
    // sec: 1721234569
    // nanosec: 456789123
    // ---
    const seconds = split_by_dashes.map(msg => {
        const parts = msg.split('\n').map(line => line.trim()).filter(line => line.startsWith('sec:'));
        return parts.length > 0 ? parseInt(parts[0].split(':')[1].trim()) : null;
    }).filter(sec => sec !== null);

    const nanoseconds = split_by_dashes.map(msg => {
        const parts = msg.split('\n').map(line => line.trim()).filter(line => line.startsWith('nanosec:'));
        return parts.length > 0 ? parseInt(parts[0].split(':')[1].trim()) : null;
    }).filter(nsec => nsec !== null);

    // assert same length
    if (seconds.length !== nanoseconds.length) {
        output.textContent = 'Error: Mismatched number of seconds and nanoseconds.';
        return;
    }

    //timestamps in nanoseconds combined
    const timestamps = seconds.map((sec, index) => sec * 1e9 + nanoseconds[index]);

    // Calculate frequency in Hz
    const sortedTimestamps = timestamps.sort((a, b) => a - b);

    const firstTimestamp = sortedTimestamps[0];
    const lastTimestamp = sortedTimestamps[sortedTimestamps.length - 1];
    const durationInSeconds = (lastTimestamp - firstTimestamp) / 1e9; // Convert nanoseconds to seconds
    if (durationInSeconds <= 0) {
        output.textContent = 'Error: Invalid timestamps or zero duration.';
        return;
    }
    // Calculate frequency
    // 1,2,3 --> should lead to 1 Hz
    // 1,2,3,4 --> should lead to 1 Hz
    const frequency = (sortedTimestamps.length-1) / durationInSeconds; // Hz
    

  
    output.textContent = `Calculated frequency: ${frequency.toFixed(4)} Hz`;
  }