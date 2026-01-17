package com.Medicare.dto;

public class AdminStatsDTO {
    private long totalUsers;
    private long totalDoctors;
    private long totalReservations;
    private long pendingDoctors;
    private long confirmedDoctors;
    private long rejectedDoctors;
    private long pendingReservations;
    private long confirmedReservations;
    private long cancelledReservations;
    private long completedReservations;

    public AdminStatsDTO() {}

    public AdminStatsDTO(long totalUsers, long totalDoctors, long totalReservations, 
                         long pendingDoctors, long confirmedDoctors, long rejectedDoctors,
                         long pendingReservations, long confirmedReservations, 
                         long cancelledReservations, long completedReservations) {
        this.totalUsers = totalUsers;
        this.totalDoctors = totalDoctors;
        this.totalReservations = totalReservations;
        this.pendingDoctors = pendingDoctors;
        this.confirmedDoctors = confirmedDoctors;
        this.rejectedDoctors = rejectedDoctors;
        this.pendingReservations = pendingReservations;
        this.confirmedReservations = confirmedReservations;
        this.cancelledReservations = cancelledReservations;
        this.completedReservations = completedReservations;
    }

    // Getters and Setters
    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalDoctors() {
        return totalDoctors;
    }

    public void setTotalDoctors(long totalDoctors) {
        this.totalDoctors = totalDoctors;
    }

    public long getTotalReservations() {
        return totalReservations;
    }

    public void setTotalReservations(long totalReservations) {
        this.totalReservations = totalReservations;
    }

    public long getPendingDoctors() {
        return pendingDoctors;
    }

    public void setPendingDoctors(long pendingDoctors) {
        this.pendingDoctors = pendingDoctors;
    }

    public long getConfirmedDoctors() {
        return confirmedDoctors;
    }

    public void setConfirmedDoctors(long confirmedDoctors) {
        this.confirmedDoctors = confirmedDoctors;
    }

    public long getRejectedDoctors() {
        return rejectedDoctors;
    }

    public void setRejectedDoctors(long rejectedDoctors) {
        this.rejectedDoctors = rejectedDoctors;
    }

    public long getPendingReservations() {
        return pendingReservations;
    }

    public void setPendingReservations(long pendingReservations) {
        this.pendingReservations = pendingReservations;
    }

    public long getConfirmedReservations() {
        return confirmedReservations;
    }

    public void setConfirmedReservations(long confirmedReservations) {
        this.confirmedReservations = confirmedReservations;
    }

    public long getCancelledReservations() {
        return cancelledReservations;
    }

    public void setCancelledReservations(long cancelledReservations) {
        this.cancelledReservations = cancelledReservations;
    }

    public long getCompletedReservations() {
        return completedReservations;
    }

    public void setCompletedReservations(long completedReservations) {
        this.completedReservations = completedReservations;
    }
}
