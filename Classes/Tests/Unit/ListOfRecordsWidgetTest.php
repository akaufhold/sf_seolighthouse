<?php 

declare(strict_types=1);

namespace Stackfactory\SfSeolighthouse\Tests\Unit;

use \PHPUnit\Framework\TestCase;

use TYPO3\TestingFramework\Core\Unit\UnitTestCase;
use \Stackfactory\SfSeolighthouse\Widgets\ListOfRecordsWidget;

use TYPO3\CMS\Dashboard\Widgets\AdditionalCssInterface;
use TYPO3\CMS\Dashboard\Widgets\ButtonProviderInterface;
use TYPO3\CMS\Dashboard\Widgets\RequireJsModuleInterface;
use TYPO3\CMS\Dashboard\Widgets\WidgetConfigurationInterface;
use TYPO3\CMS\Dashboard\Widgets\WidgetInterface;
use TYPO3\CMS\Fluid\View\StandaloneView;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use \TYPO3\CMS\Backend\Utility\BackendUtility;
use Stackfactory\SfSeolighthouse\Controller;

/** 
  *Test
	**/
class ListOfRecordsWidgetTest extends UnitTestCase {

	protected $lor = null;

	/** 
	*@test
	*@dataProvider renderWidgetContent
	**/
	public function TestrenderWidgetContent() :void {
    $slug       = BackendUtility::getPreviewUrl($this->pageId);
		//$this->lor = new ListOfRecordsWidget();
		self::assertInstanceOf(ListOfRecordsWidget::class, $this->lor);
	}
}#