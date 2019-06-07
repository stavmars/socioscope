package gr.ekke.socioscope.service.dto;

public class SeriesPoint {

    private String x;
    private double y;

    public SeriesPoint(String x, double y) {
        this.x = x;
        this.y = y;
    }

    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x;
    }

    public double getY() {
        return y;
    }

    public void setY(double y) {
        this.y = y;
    }

}
