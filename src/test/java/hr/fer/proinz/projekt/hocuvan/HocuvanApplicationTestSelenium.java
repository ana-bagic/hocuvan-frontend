package hr.fer.proinz.projekt.hocuvan;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

class HocuvanApplicationTestSelenium {

	@Test
	public void test01() throws InterruptedException {
		WebDriver driver = new ChromeDriver();
		System.setProperty("webdriver.chrome.driver",
				"C:\\Program Files (x86)\\crome_driver\\chromedriver_win32\\chromedriver.exe");
		driver.get("http://localhost:4200/");

		WebElement element = driver.findElement(By.cssSelector("a[routerlink='/signup']"));
		element.click();

		element = driver.findElement(By.cssSelector("input[formcontrolname='username']"));
		element.sendKeys("tst01");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='firstName'"));
		element.sendKeys("Ime");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='lastName'"));
		element.sendKeys("Prezime");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='email'"));
		element.sendKeys("email@email.com");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='password'"));
		element.sendKeys("123456");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='confirmPassword'"));
		element.sendKeys("123456");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='phoneNumber'"));
		element.sendKeys("098776455");

		driver.findElement(By.cssSelector("button[class='btn btn-primary']")).click();

		Thread.sleep(1500L);

		String redirURL = driver.getCurrentUrl();

		boolean compRes = redirURL.equals("http://localhost:4200/signup/favorites");

		System.out.println(redirURL);

		assertEquals(compRes, true);

		driver.quit();
	}

	@Test
	public void test02() throws InterruptedException {
		WebDriver driver = new ChromeDriver();
		System.setProperty("webdriver.chrome.driver",
				"C:\\Program Files (x86)\\crome_driver\\chromedriver_win32\\chromedriver.exe");
		driver.get("http://localhost:4200/");

		WebElement element = driver.findElement(By.cssSelector("a[routerlink='/signup']"));
		element.click();

		element = driver.findElement(By.cssSelector("input[formcontrolname='username']"));
		element.sendKeys("tst02");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='firstName'"));
		element.sendKeys("Ime");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='lastName'"));
		element.sendKeys("Prezime");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='email'"));
		element.sendKeys("email@email.com");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='password'"));
		element.sendKeys("123456789");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='confirmPassword'"));
		element.sendKeys("123456");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='phoneNumber'"));
		element.sendKeys("098776455");

		driver.findElement(By.cssSelector("button[class='btn btn-primary']")).click();

		Thread.sleep(1000L);

		assertDoesNotThrow(() -> findByXPath("Lozinke moraju biti jednake", driver));
		driver.quit();
	}

	@Test
	public void test03() throws InterruptedException {
		WebDriver driver = new ChromeDriver();
		System.setProperty("webdriver.chrome.driver",
				"C:\\Program Files (x86)\\crome_driver\\chromedriver_win32\\chromedriver.exe");
		driver.get("http://localhost:4200/");

		WebElement element = driver.findElement(By.cssSelector("a[routerlink='/signup']"));
		element.click();
		element = driver.findElement(By.cssSelector("input[formcontrolname='username']"));
		element.sendKeys("tst01");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='firstName'"));
		element.sendKeys("Ime");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='lastName'"));
		element.sendKeys("Prezime");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='email'"));
		element.sendKeys("email@email.com");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='password'"));
		element.sendKeys("123456");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='confirmPassword'"));
		element.sendKeys("123456");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='phoneNumber'"));
		element.sendKeys("098776455");

		driver.findElement(By.cssSelector("button[class='btn btn-primary']")).click();

		Thread.sleep(1000L);

		assertDoesNotThrow(() -> findByXPath("Korisnik s tim korisničkim imenom već postoji", driver));
		driver.quit();
	}

	@Test
	public void test04() throws InterruptedException {
		WebDriver driver = new ChromeDriver();
		System.setProperty("webdriver.chrome.driver",
				"C:\\Program Files (x86)\\crome_driver\\chromedriver_win32\\chromedriver.exe");
		driver.get("http://localhost:4200/");

		WebElement element = driver.findElement(By.cssSelector("a[routerlink='/signup']"));
		element.click();
		element = driver.findElement(By.cssSelector("input[formcontrolname='username']"));
		element.sendKeys("tst04");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='firstName'"));
		element.sendKeys("Ime");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='lastName'"));
		element.sendKeys("Prezime");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='email'"));
		element.sendKeys("lala");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='password'"));
		element.sendKeys("123456");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='confirmPassword'"));
		element.sendKeys("123456");
		element = driver.findElement(By.cssSelector("input[ng-reflect-name='phoneNumber'"));
		element.sendKeys("098776455");

		driver.findElement(By.cssSelector("button[class='btn btn-primary']")).click();
		Thread.sleep(1000L);

		assertDoesNotThrow(() -> findByXPath("Email adresa nije validna", driver));

		driver.quit();
	}

	@Test
	public void test05() throws InterruptedException {
		WebDriver driver = new ChromeDriver();
		System.setProperty("webdriver.chrome.driver",
				"C:\\Program Files (x86)\\crome_driver\\chromedriver_win32\\chromedriver.exe");
		driver.get("http://localhost:4200/");

		WebElement element = driver.findElement(By.cssSelector("a[routerlink='/signup']"));
		element.click();

		driver.findElement(By.cssSelector("button[class='btn btn-primary']")).click();
		Thread.sleep(1000L);

		assertDoesNotThrow(() -> findByXPath("Korisničko ime je obavezno", driver));
		assertDoesNotThrow(() -> findByXPath("Ime je obavezno", driver));
		assertDoesNotThrow(() -> findByXPath("Prezime je obavezno", driver));
		assertDoesNotThrow(() -> findByXPath("Email adresa je obavezna", driver));
		assertDoesNotThrow(() -> findByXPath("Lozinka je obavezna", driver));
		assertDoesNotThrow(() -> findByXPath("Ponovljena lozinka je obavezna", driver));
		assertDoesNotThrow(() -> findByXPath("Broj mobitela je obavezan", driver));

		driver.quit();
	}

	public void findByXPath(String string, WebDriver driver) {
		driver.findElement(By.xpath("//*[text()='" + string + "']"));
	}

}
