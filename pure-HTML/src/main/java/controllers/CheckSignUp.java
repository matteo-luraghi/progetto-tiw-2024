package controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import beans.User;
import dao.UserDAO;
import utils.ConnectionHandler;

/**
 * Servlet implementation class CheckSignUp
 */
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
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String username = request.getParameter("username");
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		String repeatPassword = request.getParameter("repeatPassword");
		String name = request.getParameter("name");
		String surname = request.getParameter("surname");
		
		UserDAO uDao = new UserDAO(connection);
		User u = null;
		boolean validUser = true;
		
		String error = "";
		
		try {
			validUser = uDao.checkNewUsername(username);
			if (!validUser) {
				error += "Username non disponibile\n";
			}
		} catch (SQLException e) {
			response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Failure in worker's project database extraction");
		}
		
		// email checking
		String regex = "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$";
		Pattern pattern = Pattern.compile(regex);  
		Matcher matcher = pattern.matcher(email);  
		if(!matcher.matches()) {
			validUser = false;
			error += "Email non valida\n";
		}
		
		if(!password.equals(repeatPassword)) {
			validUser = false;
			error += "Password e ripeti password diverse\n";
		}
			
		String path = getServletContext().getContextPath();
		
		if (validUser) {
			try {
				int userId = uDao.createUser(username, email, password, name, surname);
				u = uDao.getUser(userId);	
			} catch (SQLException e) {
				response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Failure in update of the database");
			}
			request.getSession().setAttribute("user", u);
			path = path + "/GoToHomepage";
		}
		else {
			path = getServletContext().getContextPath() + "/index.html";
		}
		
		response.sendRedirect(path);
	}

	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
}
