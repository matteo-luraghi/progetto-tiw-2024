package beans;

public class User {
	private final String email;
	private final String name;
	private final String surname;
	
	public User(String email, String name, String surname) {
		this.email = email;
		this.name = name;
		this.surname = surname;
	}
	
	public String getEmail() {
		return this.email;
	}
	
	public String getName() {
		return this.name;
	}
	
	public String getSurname() {
		return this.surname;
	}
}
