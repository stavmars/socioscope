package gr.ekke.socioscope.domain;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.Map;

public class GeoMap implements Serializable {

    private static final long serialVersionUID = 1L;

    private int level = 0;

    @NotBlank
    private Map<String, @NotBlank String> name;

    private String url;

    public GeoMap() {
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public Map<String, String> getName() {
        return name;
    }

    public void setName(Map<String, String> name) {
        this.name = name;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
