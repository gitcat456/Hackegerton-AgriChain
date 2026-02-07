import { Chip } from '@mui/material';
import {
    CheckCircle,
    HourglassEmpty,
    Cancel,
    LocalShipping,
    Lock,
    LockOpen,
    Schedule,
    PlayArrow,
    Done
} from '@mui/icons-material';

/**
 * Status Badge component for displaying various statuses
 */
const StatusBadge = ({ status, size = 'small', variant = 'filled' }) => {
    const statusConfig = {
        // Loan statuses
        APPROVED: {
            color: 'success',
            icon: <CheckCircle sx={{ fontSize: 16 }} />,
            label: 'Approved'
        },
        PENDING: {
            color: 'warning',
            icon: <HourglassEmpty sx={{ fontSize: 16 }} />,
            label: 'Pending'
        },
        REJECTED: {
            color: 'error',
            icon: <Cancel sx={{ fontSize: 16 }} />,
            label: 'Rejected'
        },
        ACTIVE: {
            color: 'info',
            icon: <PlayArrow sx={{ fontSize: 16 }} />,
            label: 'Active'
        },
        COMPLETED: {
            color: 'success',
            icon: <Done sx={{ fontSize: 16 }} />,
            label: 'Completed'
        },

        // Order statuses
        PAID: {
            color: 'success',
            icon: <CheckCircle sx={{ fontSize: 16 }} />,
            label: 'Paid'
        },
        DISPATCHED: {
            color: 'info',
            icon: <LocalShipping sx={{ fontSize: 16 }} />,
            label: 'Dispatched'
        },
        RECEIVED: {
            color: 'primary',
            icon: <CheckCircle sx={{ fontSize: 16 }} />,
            label: 'Received'
        },
        ORDERED: {
            color: 'default',
            icon: <Schedule sx={{ fontSize: 16 }} />,
            label: 'Ordered'
        },
        RELEASED: {
            color: 'success',
            icon: <LockOpen sx={{ fontSize: 16 }} />,
            label: 'Released'
        },

        // Escrow statuses
        LOCKED: {
            color: 'warning',
            icon: <Lock sx={{ fontSize: 16 }} />,
            label: 'In Escrow'
        },

        // Listing statuses
        SOLD: {
            color: 'default',
            icon: <Done sx={{ fontSize: 16 }} />,
            label: 'Sold'
        },
        DRAFT: {
            color: 'default',
            icon: <Schedule sx={{ fontSize: 16 }} />,
            label: 'Draft'
        },
    };

    const config = statusConfig[status?.toUpperCase()] || {
        color: 'default',
        icon: null,
        label: status || 'Unknown'
    };

    return (
        <Chip
            icon={config.icon}
            label={config.label}
            color={config.color}
            size={size}
            variant={variant}
            sx={{
                fontWeight: 600,
                '& .MuiChip-icon': {
                    marginLeft: '8px',
                },
            }}
        />
    );
};

export default StatusBadge;
