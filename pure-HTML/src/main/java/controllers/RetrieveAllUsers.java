package controllers;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.sql.Connection;
import java.sql.SQLException;
import utils.ConnectionHandler;
import javax.servlet.ServletContext;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;
import java.util.ArrayList;

import beans.User;
import dao.UserDAO;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;

/**
 * Servlet implementation class RetrieveAllUsers
 */
@WebServlet("/RetrieveAllUsers")
public class RetrieveAllUsers extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	private TemplateEngine templateEngine;

    public RetrieveAllUsers() {
        super();
    }
    
    public void init() throws ServletException {
		ServletContext servletContext = getServletContext();
		connection = ConnectionHandler.getConnection(servletContext);
		ServletContextTemplateResolver templateResolver = new ServletContextTemplateResolver(servletContext);
		templateResolver.setTemplateMode(TemplateMode.HTML);
		this.templateEngine = new TemplateEngine();
		this.templateEngine.setTemplateResolver(templateResolver);
		templateResolver.setSuffix(".html");
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String loginpath = getServletContext().getContextPath() + "/index.html";
		User u = null;
		HttpSession s = request.getSession();
		ArrayList<User> registeredUsers = null;
		
		if (s.isNew() || s.getAttribute("user") == null) {
			response.sendRedirect(loginpath);
			return;
		} else {
			u = (User) s.getAttribute("user");
		}
		
		String title = request.getParameter("title");
		int duration = Integer.parseInt(request.getParameter("duration"));
		int min_participants = Integer.parseInt(request.getParameter("min_participants"));
		int max_participants = Integer.parseInt(request.getParameter("max_participants"));
		
		if (min_participants > max_participants) {
			s.setAttribute("minError", true);
			String path = getServletContext().getContextPath() + "/GoToHomepage";
			response.sendRedirect(path);
		}
		
		s.setAttribute("title", title);
		s.setAttribute("duration", duration);
		s.setAttribute("min_participants", min_participants);
		s.setAttribute("max_participants", max_participants);
		
		try {
			UserDAO uDao = new UserDAO(connection);
			registeredUsers = uDao.getRegisteredUsers();
		} catch (SQLException e) {
			response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Failure in worker's project database extraction");
		}
		
		if (registeredUsers != null) {
			// remove self from the invite list
			registeredUsers.remove(u);
			String path = "WEB-INF/RegisteredUsers.html";
			ServletContext servletContext = getServletContext();
			final WebContext ctx = new WebContext(request, response, servletContext, request.getLocale());
			ctx.setVariable("registeredUsers", registeredUsers);
			ctx.setVariable("highlighted", false);
			ctx.setVariable("error_message", "");		
			ctx.setVariable("selectedUsers", new ArrayList<User>()); // passing empty array
			templateEngine.process(path, ctx, response.getWriter());	
		} else {
			String path = getServletContext().getContextPath() + "/GoToHomepage";
			response.sendRedirect(path);
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
