package gr.ekke.socioscope.service.dto;


import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

public class Series {

    String id;
    String color;
    List<SeriesPoint> data;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<SeriesPoint> getData() {
        return data;
    }

    public void setData(List<SeriesPoint> data) {
        this.data = data;
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
