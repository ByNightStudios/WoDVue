function renderStatus(data) {
    // Inactive, Scheduled for Initiation, Active, Paused, Expired, Cancelled)
    switch (toNumber(data)) {
        case 0 || '0':
            return 'Scheduled for Initiation';
        case 1 || '1':
            return 'Active';
        case 2 || '2':
            return 'Expired';
        case 3 || '3':
            return 'Cancelled';
        case 4 || '4':
            return 'Paused';
        default:
            return 'N/A';
    }
};