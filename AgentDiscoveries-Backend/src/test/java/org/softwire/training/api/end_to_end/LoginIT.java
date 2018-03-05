package org.softwire.training.api.end_to_end;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.softwire.training.api.end_to_end.helper.E2eHelper;

import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class LoginIT {
    public static final String Target_Address = System.getProperty("target.address");

    private static WebDriver driver;
    private static E2eHelper helper;

    @BeforeAll
    public static void setUp() {
        ChromeOptions options = new ChromeOptions()
                .addArguments("headless")
                .addArguments("no-sandbox")
                .addArguments("window-size=1024,768");
        //^This line should be specified at command line to not occur locally.
        driver = new ChromeDriver(options);
        helper = new E2eHelper();
        driver.manage().timeouts()
                .implicitlyWait(10, TimeUnit.SECONDS)
                .pageLoadTimeout(2, TimeUnit.SECONDS);
    }

    @AfterAll
    public static void tearDown() {
        driver.quit();
    }

    @Test
    public void testTitle() {
        driver.get(Target_Address);
        String title = driver.getTitle();
        assertTrue(title.equals("Agent Discoveries"));
    }

    @Test
    public void testCanLogIn() {
        helper.login(driver, Target_Address);
        WebElement navBarRight = driver.findElement(By.className("navbar-right"));
        assertTrue(navBarRight.getText().contains("Log Out"));
    }
}
