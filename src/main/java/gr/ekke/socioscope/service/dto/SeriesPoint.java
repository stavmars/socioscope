package gr.ekke.socioscope.service.dto;

public class SeriesPoint {

    private String x;
    private Double y;

    public SeriesPoint(String x, Double y) {
        this.x = x;
        this.y = y;
    }

    public String getX() {
        return x;
    }

    public void setX(String x) {
        this.x = x;
    }

    public Double getY() {
        return y;
    }

    public void setY(Double y) {
        this.y = y;
    }

    @Override
    public String toString() {
        return "SeriesPoint{" +
            "x='" + x + '\'' +
            ", y=" + y +
            '}';
    }
}
