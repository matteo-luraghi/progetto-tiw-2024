package controllers;

import java.sql.Connection;
import java.sql.SQLException;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import utils.ConnectionHandler;
import org.apache.commons.lang.StringEscapeUtils;
import beans.User;
import dao.UserDAO;


@WebServlet("/CheckSignUp")
public class CheckSignUp extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
       
    public CheckSignUp() {
        super();
    }

	public void init() throws ServletException {
		connection = ConnectionHandler.getConnection(getServletContext());
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		HttpSession s = request.getSession();
		
		String name = null;
		String surname = null;
		String username = null;
		String email = null;
		String password = null;
		String repeatPassword = null;

		name = StringEscapeUtils.escapeJava(request.getParameter("name"));
		surname = StringEscapeUtils.escapeJava(request.getParameter("surname"));
		username = StringEscapeUtils.escapeJava(request.getParameter("username"));
		email = StringEscapeUtils.escapeJava(request.getParameter("email"));
		password = StringEscapeUtils.escapeJava(request.getParameter("password"));
		repeatPassword = StringEscapeUtils.escapeJava(request.getParameter("repeatPassword"));

		if (name == null || surname == null || username == null || email == null || password == null || repeatPassword == null ||
				name.isEmpty() || surname.isEmpty() || username.isEmpty() || email.isEmpty() || password.isEmpty() || repeatPassword.isEmpty()) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			response.getWriter().println("Credentials must be not null");
			return;
		}

		UserDAO uDao = new UserDAO(connection);
		User u = null;
		boolean validUser = true;
		
		try {
			validUser = uDao.checkNewUsername(username);
		} catch (SQLException e) {
			response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			response.getWriter().println("Failure in database extraction");
		}
		
		//TODO: other checks on parameters, both here and in js 
				
		if (validUser) {
			try {
				int userId = uDao.createUser(username, email, password, name, surname);
				u = uDao.getUser(userId);	
			} catch (SQLException e) {
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				response.getWriter().println("Failure in update of the database");
				return;
			}
			s.setAttribute("user", u);
		}

	}

	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
