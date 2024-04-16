package controllers;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

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
	private TemplateEngine templateEngine;

	
    public CheckSignUp() {
        super();
    }
    
    public void init() throws ServletException {
    	ServletContext servletContext = getServletContext();
 		connection = ConnectionHandler.getConnection(servletContext);
 		ServletContextTemplateResolver templateResolver = new ServletContextTemplateResolver(servletContext);
 		templateResolver.setTemplateMode(TemplateMode.HTML);
		this.templateEngine = new TemplateEngine();
		this.templateEngine.setTemplateResolver(templateResolver);
		templateResolver.setSuffix(".html");	}

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
		
		String username_error = "";
		String email_error = "";
		String password_error = "";
		
		try {
			validUser = uDao.checkNewUsername(username);
			if (!validUser) {
				username_error = "Username non disponibile";
			}
		} catch (SQLException e) {
			response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Failure in worker's project database extraction");
			return;
		}
		
		// email checking
		String regex = "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$";
		Pattern pattern = Pattern.compile(regex);  
		Matcher matcher = pattern.matcher(email);  
		if(!matcher.matches()) {
			validUser = false;
			email_error = "Email non valida\n";
		}
		
		if(!password.equals(repeatPassword)) {
			validUser = false;
			password_error = "Password e ripeti password diverse\n";
		}
			
		String path = getServletContext().getContextPath();
		
		if (validUser) {
			try {
				int userId = uDao.createUser(username, email, password, name, surname);
				u = uDao.getUser(userId);	
			} catch (SQLException e) {
				response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Failure in update of the database");
				return;
			}
			request.getSession().setAttribute("user", u);
			path += "/GoToHomepage";
			response.sendRedirect(path);
		}
		else {
			// display the error in index.html
			path = "/index.html";
			ServletContext servletContext = getServletContext();
			final WebContext ctx = new WebContext(request, response, servletContext, request.getLocale());
			ctx.setVariable("username_error", username_error);
			ctx.setVariable("email_error", email_error);
			ctx.setVariable("password_error", password_error);
			templateEngine.process(path, ctx, response.getWriter());
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
