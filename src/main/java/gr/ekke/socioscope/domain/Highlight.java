package gr.ekke.socioscope.domain;

import javax.validation.constraints.NotBlank;
import java.util.Map;

/**
 * A Highlight.
 */
public class Highlight {

    @NotBlank
    private String id;

    private Map<String, String> description;

    private SeriesOptions seriesOptions;

    private String visType;

    private String subType;

    private Integer level;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getDescription() {
        return description;
    }

    public void setDescription(Map<String, String> description) {
        this.description = description;
    }

    public SeriesOptions getSeriesOptions() {
        return seriesOptions;
    }

    public void setSeriesOptions(SeriesOptions seriesOptions) {
        this.seriesOptions = seriesOptions;
    }

    public String getVisType() {
        return visType;
    }

    public void setVisType(String visType) {
        this.visType = visType;
    }

    public String getSubType() {
        return subType;
    }

    public void setSubType(String subType) {
        this.subType = subType;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    @Override
    public String toString() {
        return "Highlight{" +
            "id='" + id + '\'' +
            ", description=" + description +
            ", seriesOptions=" + seriesOptions +
            ", visType='" + visType + '\'' +
            ", level=" + level +
            '}';
    }
}
