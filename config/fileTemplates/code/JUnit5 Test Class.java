import org.hamcrest.MatcherAssert;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.hamcrest.MockitoHamcrest;
import static org.hamcrest.Matchers.*;
import static org.mockito.Mockito.*;

#parse("File Header.java")
class ${NAME} {
  ${BODY}
}