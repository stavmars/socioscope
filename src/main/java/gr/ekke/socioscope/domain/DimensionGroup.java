package gr.ekke.socioscope.domain;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Map;

/**
 * A Dimension group.
 */
public class DimensionGroup implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;

    @Size(min = 1)
    private Map<String, @NotBlank String> name;

    private Map<String, @NotBlank String> description;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Map<String, String> getName() {
        return name;
    }

    public void setName(Map<String, String> name) {
        this.name = name;
    }

    public Map<String, String> getDescription() {
        return description;
    }

    public void setDescription(Map<String, String> description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "DimensionGroup{" +
            "id='" + id + '\'' +
            ", name=" + name +
            ", description=" + description +
            '}';
    }
}
