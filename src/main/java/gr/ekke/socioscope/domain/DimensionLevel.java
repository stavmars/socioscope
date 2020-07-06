package gr.ekke.socioscope.domain;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Map;

public class DimensionLevel implements Serializable {

    private static final long serialVersionUID = 1L;

    private int depth = 0;

    @NotBlank
    private Map<String, @NotBlank String> name;

    private String mapUrl;

    public DimensionLevel() {
    }

    public int getDepth() {
        return depth;
    }

    public void setDepth(int depth) {
        this.depth = depth;
    }

    public Map<String, String> getName() {
        return name;
    }

    public void setName(Map<String, String> name) {
        this.name = name;
    }

    public String getMapUrl() {
        return mapUrl;
    }

    public void setMapUrl(String mapUrl) {
        this.mapUrl = mapUrl;
    }

    @Override
    public String toString() {
        return "DimensionLevel{" +
            "depth=" + depth +
            ", name=" + name +
            ", mapUrl='" + mapUrl + '\'' +
            '}';
    }
}
