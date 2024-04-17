package controllers;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import utils.ConnectionHandler;
import javax.servlet.ServletContext;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.text.ParseException;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.WebContext;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import beans.User;
import beans.Group;
import dao.GroupDAO;

/**
 * Servlet implementation class Homepage
 */
@WebServlet("/Homepage")
public class Homepage extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection connection = null;
	private TemplateEngine templateEngine;

	       
    public Homepage() {
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
		String loginpath = getServletContext().getContextPath() + "/index.html";
		User u = null;
		HttpSession s = request.getSession();
		if (s.isNew() || s.getAttribute("user") == null) {
			response.sendRedirect(loginpath);
			return;
		} else {
			u = (User) s.getAttribute("user");
		}
		
		GroupDAO gDao = new GroupDAO(connection);
		
		ArrayList<Group> createdGroups = new ArrayList<>();
		ArrayList<Group> activeGroups = new ArrayList<>();
		
		try {
			createdGroups = gDao.getCreatedByUser(u.getId());
		} catch (SQLException | ParseException e) {
			response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Failure in worker's project database extraction");
			return;
		}
		
		try {
			activeGroups = gDao.getContainsUser(u.getId());	
		} catch (SQLException | ParseException e) {
			response.sendError(HttpServletResponse.SC_BAD_GATEWAY, "Failure in worker's project database extraction");
			return;
		}
		
		boolean warning;
		if (s.getAttribute("minError") == null) {
			warning = false;
		} else {
			warning = (boolean) s.getAttribute("minError");
		}
		s.removeAttribute("minError");
		s.removeAttribute("errors");
		
		String path = "WEB-INF/Homepage.html";
		ServletContext servletContext = getServletContext();
		final WebContext ctx = new WebContext(request, response, servletContext, request.getLocale());
		ctx.setVariable("createdGroups", createdGroups);
		ctx.setVariable("activeGroups", activeGroups);
		ctx.setVariable("minError", warning);
		templateEngine.process(path, ctx, response.getWriter());
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}
	
	public void destroy() {
		try {
			ConnectionHandler.closeConnection(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
